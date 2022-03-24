---
layout: post
title: 多线程死锁 - 野猫
date: 2021-05-29 16:12:31.000000000 +08:00
tags: 多线程 , 死锁 , 并发 , 异步
---

>版权声明：本文为 @WildMeowth
的原创文章, 可以转载, 但请务必注明作者和出处！！！
原文链接：[wildmeowth](http://wildmeowth.github.io/2021/05/dead-lock-in-thread/)



说有五个哲学家，围着桌子要吃饭，但桌上只有五根筷子，分别在每个人的左手边和右手边，想要吃上饭，必须要拿到两根筷子凑成一双才行，每次只能拿一根筷子，如下图

![eat](/assets/images/20210529/eat.png)

每个哲学家从左边开始拿筷子，拿完拿右边，于是发现每个人只拿了一根筷子。结果就是没有任何一个人能开始吃饭，循环卡在这里了，哲学家们干瞪眼中。。。

```java
package com.wildemeowth.thread;
public class Chopsticks {
	private int name;

	public Chopsticks(int name) {
		super();
		this.name = name;
	}

	public int getName() {
		return name;
	}

	public void setName(int name) {
		this.name = name;
	}
}
```
```java
package com.wildemeowth.thread;
public class Philosopher extends Thread {
	private int name;
	private Chopsticks leftcs;
	private Chopsticks rightcs;
	public Philosopher(int name, Chopsticks leftcs, Chopsticks rightcs) {
		super();
		this.name = name;
		this.leftcs = leftcs;
		this.rightcs = rightcs;
	}
	@Override
	public void run() {
		super.run();
		eat();
	}
	private void eat() {
        synchronized(leftcs){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            System.out.println(this.name +"get the left chopsticks"+leftcs.getName());
            synchronized(rightcs) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                System.out.println(this.name + "get the second chopsticks start to eat"+ rightcs.getName());
            }
        }	
	}
}

```
```java
package com.wildemeowth.thread;
public class App {

	public static void main(String[] args) {
		Chopsticks cs1 = new Chopsticks(1);
		Chopsticks cs2 = new Chopsticks(2);
		Chopsticks cs3 = new Chopsticks(3);
		Chopsticks cs4 = new Chopsticks(4);
		Chopsticks cs5 = new Chopsticks(5);
		
		Philosopher ps1 = new Philosopher(1,cs1,cs2);
		Philosopher ps2 = new Philosopher(2,cs2,cs3);
		Philosopher ps3 = new Philosopher(3,cs3,cs4);
		Philosopher ps4 = new Philosopher(4,cs4,cs5);
		Philosopher ps5 = new Philosopher(5,cs5,cs1);
		
		ps1.start();
		ps2.start();
		ps3.start();
		ps4.start();
		ps5.start();
	}

}
```
运行结果，所有人都只拿到了一根筷子，吃不上饭了。
```
1get the left chopsticks1
2get the left chopsticks2
3get the left chopsticks3
4get the left chopsticks4
5get the left chopsticks5
```

用jstack 简单查看可确定已经死锁
```
Java stack information for the threads listed above:
===================================================
"Thread-4":
	at com.wildemeowth.thread.Philosopher.eat(Philosopher.java:30)
	- waiting to lock <0x00000000d66742d0> (a com.wildemeowth.thread.Chopsticks)
	- locked <0x00000000d6674310> (a com.wildemeowth.thread.Chopsticks)
	at com.wildemeowth.thread.Philosopher.run(Philosopher.java:16)
"Thread-0":
	at com.wildemeowth.thread.Philosopher.eat(Philosopher.java:30)
	- waiting to lock <0x00000000d66742e0> (a com.wildemeowth.thread.Chopsticks)
	- locked <0x00000000d66742d0> (a com.wildemeowth.thread.Chopsticks)
	at com.wildemeowth.thread.Philosopher.run(Philosopher.java:16)
"Thread-1":
	at com.wildemeowth.thread.Philosopher.eat(Philosopher.java:30)
	- waiting to lock <0x00000000d66742f0> (a com.wildemeowth.thread.Chopsticks)
	- locked <0x00000000d66742e0> (a com.wildemeowth.thread.Chopsticks)
	at com.wildemeowth.thread.Philosopher.run(Philosopher.java:16)
"Thread-2":
	at com.wildemeowth.thread.Philosopher.eat(Philosopher.java:30)
	- waiting to lock <0x00000000d6674300> (a com.wildemeowth.thread.Chopsticks)
	- locked <0x00000000d66742f0> (a com.wildemeowth.thread.Chopsticks)
	at com.wildemeowth.thread.Philosopher.run(Philosopher.java:16)
"Thread-3":
	at com.wildemeowth.thread.Philosopher.eat(Philosopher.java:30)
	- waiting to lock <0x00000000d6674310> (a com.wildemeowth.thread.Chopsticks)
	- locked <0x00000000d6674300> (a com.wildemeowth.thread.Chopsticks)
	at com.wildemeowth.thread.Philosopher.run(Philosopher.java:16)

Found 1 deadlock.

````

如何解决？
上述例子中，我们发现，哲学家们全体都是左撇子，喜欢先拿左边的筷子。那么我们让其中一部分哲学家变成右撇子会咋样呢。

想象一下，顺时针顺序下，第一个哲学家是右撇子拿了右手边筷子，他下一步准备拿左手，第二个哲学家左撇子拿了左手筷子，下一步拿他右边筷子，那么第一第二这两位哲学家必然在下一步有一个能拿到第二根筷子于是他吃完了饭，放下了所有筷子。死锁解决。

改进 Philosopher类 eat 方法
```java
private void eat() {
	if(this.name%2==0) {
		synchronized(leftcs){
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println(this.name +"get the left chopsticks"+leftcs.getName());
			synchronized(rightcs) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				System.out.println(this.name + "get the second chopsticks start to eat"+ rightcs.getName());
			}
		}
	}else {
		synchronized(rightcs){
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println(this.name +"get the right chopsticks"+rightcs.getName());
			synchronized(leftcs) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				System.out.println(this.name + "get the second chopsticks start to eat"+ leftcs.getName());
			}
		}
	}
}

```
奇数右撇子，偶数左撇子。


