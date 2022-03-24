---
layout: post
title: 排查：进程 - 野猫
date: 2021-06-04 10:35:03.000000000 +08:00
tags: JVM , CPU , JAVA
---

>版权声明：本文为 @WildMeowth
的原创文章, 可以转载, 但请务必注明作者和出处！！！
原文链接：[wildmeowth](http://wildmeowth.github.io/2021/06/view-process-and-thread/)


上篇在查看多线程死锁问题的时候，我们用到了jstack命令。Linux有一些相关的命令可以查看进程情况，本文做一下稍微的记录。

简单写段代码造成CPU满，和前文中的筷子类联动下（不用白不用）
```java
public class App {

	public static void main(String[] args) {
		while(true) {
			Chopsticks cs1 = new Chopsticks(1);
		}
	}

}
```

1. top 命令 - 直接一个top命令，看到 PID为4832的这个进程把CPU跑满了

```
top - 09:16:54 up 22 min,  2 users,  load average: 1.05, 1.15, 0.86
Tasks: 193 total,   2 running, 191 sleeping,   0 stopped,   0 zombie
%Cpu(s): 39.8 us,  0.8 sy,  0.0 ni, 59.4 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem:   8175896 total,  2947052 used,  5228844 free,    90280 buffers
KiB Swap:  4191228 total,        0 used,  4191228 free.  1069516 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                                                                                  
 4832 wildmeo+  20   0 4296188  31944  16424 S 100.2  0.4   1:46.70 java                                                                                                                                     
 2132 wildmeo+  20   0 1450044 218880  66640 S  15.1  2.7   6:42.40 compiz                                                                                                                                   
 1077 root      20   0  457804 139540  38524 S   5.2  1.7   1:34.39 Xorg                                                                                                                                     
 4807 wildmeo+  20   0  587904  30652  23516 S   2.6  0.4   0:00.83 gnome-terminal                                                                                                                           
 1840 wildmeo+  20   0  123408   3188   2800 S   0.4  0.0   0:02.20 VBoxClient                                                                                                                               
 4575 wildmeo+  20   0 5799608 675708  70524 S   0.4  8.3   2:02.68 java                                                                                                                                     
 4851 wildmeo+  20   0   29152   3384   2864 R   0.4  0.0   0:00.18 top                                                                                                                                      
后边进程省略
```

2. ps 命令 - 跑一把ps命令可以看到其具体出问题的线程

命令`ps -mp 4832 -o THREAD,tid,time `， 查询得到线程TID 4834

```
wildmeowth@wildmeowth-VirtualBox:~$ ps -mp 4832 -o THREAD,tid,time
USER     %CPU PRI SCNT WCHAN  USER SYSTEM   TID     TIME
wildmeo+ 99.3   -    - -         -      -     - 00:02:46
wildmeo+  0.0  19    - futex_    -      -  4832 00:00:00
wildmeo+ 99.2  19    - -         -      -  4834 00:02:46
wildmeo+  0.0  19    - futex_    -      -  4835 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4840 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4841 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4842 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4843 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4844 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4845 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4846 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4847 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4848 00:00:00
wildmeo+  0.0  19    - futex_    -      -  4849 00:00:00

```

顺便转下16进制方便查询

```
wildmeowth@wildmeowth-VirtualBox:~$ printf "%x\n" 4834
12e2
```

3. jstack 命令 - jdk 自带jstack 查看Java进程和线程的具体信息

`jstack 4832 | grep -25 12e2`

```
wildmeowth@wildmeowth-VirtualBox:~$ jstack 4832 | grep -25 12e2
2022-03-24 09:23:28

"Finalizer" #3 daemon prio=8 os_prio=0 tid=0x00007f9c4c082000 nid=0x12ec in Object.wait() [0x00007f9c339f8000]
   java.lang.Thread.State: WAITING (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x00000000d6608ee0> (a java.lang.ref.ReferenceQueue$Lock)
	at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)
	- locked <0x00000000d6608ee0> (a java.lang.ref.ReferenceQueue$Lock)
	at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)
	at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)

"Reference Handler" #2 daemon prio=10 os_prio=0 tid=0x00007f9c4c07d800 nid=0x12eb in Object.wait() [0x00007f9c33af9000]
   java.lang.Thread.State: WAITING (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x00000000d6606b50> (a java.lang.ref.Reference$Lock)
	at java.lang.Object.wait(Object.java:502)
	at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
	- locked <0x00000000d6606b50> (a java.lang.ref.Reference$Lock)
	at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"main" #1 prio=5 os_prio=0 tid=0x00007f9c4c00a000 nid=0x12e2 runnable [0x00007f9c542c8000]
   java.lang.Thread.State: RUNNABLE
	at com.wildemeowth.thread.App.main(App.java:23)

"VM Thread" os_prio=0 tid=0x00007f9c4c076000 nid=0x12ea runnable 

JNI global references: 11

```

4. jps 命令 - 我们也可以用Java 自带的jps 稍加观察

可以简单看出是 App类进程搞的坏事

```
wildmeowth@wildmeowth-VirtualBox:~$ jps
4832 App
4859 Jps
```

最后顺便 `kill 4832` 把它杀了
