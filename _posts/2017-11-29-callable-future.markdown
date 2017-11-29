---
layout: post
title: Callable + Future 线程异步 - 野猫
date: 2017-08-09 16:43:31.000000000 +08:00
tags: Callable Future , 线程 , 并发 , 异步
---

>版权声明：本文为 @WildMeowth
的原创文章, 可以转载, 但请务必注明作者和出处！！！
原文链接：[wildmeowth](http://wildmeowth.github.io/2017/08/callable-future/)



Callable 接口和Runnable 接口相似, 但两者也有很关键的区别. Callable 可以返回结果, Runnable 不会返回结果. 因此相对来说Callable功能更加强大.

和Runnable的run() 方法类似, Callable有一个Call() 方法, 我们可以先创建一个新的Callable, 然后使用Callable的 call() 方法, 得到返回的结果. 

```java
public static void main(String[] args) throws Exception {
    Long before = System.currentTimeMillis();
    Callable<String> callable = new Callable<String>(){

        @Override
        public String call() throws Exception {
            Thread.sleep(4000);
            return "Test Callable ";
        }

    };
    System.out.println(callable.call()+callable.call());
    long after = System.currentTimeMillis();
    System.out.println(after-before);
}
```

如上例子, 我们call了名为callable的线程两次, 显而易见第一个System.out.println得到的结果是
`Test Callable Test Callable`
第二个System.out.println得到的结果大约是8000+, 表明运行两次该线程所需要的时间大约是8000+毫秒

利用Future 也可以得到Callable返回的值, 如下
```java
public static void main(String[] args) throws Exception {
    Long before = System.currentTimeMillis();
    Callable<String> callable = new Callable<String>(){

        @Override
        public String call() throws Exception {
            Thread.sleep(4000);
            return "Test Callable";
        }
    };
    ExecutorService threadPool = Executors.newSingleThreadExecutor();
    Future<String> future = threadPool.submit(callable);
    
    System.out.println(future.get()+future.get());
    //System.out.println(callable.call()+callable.call());
    long after = System.currentTimeMillis();
    System.out.println(after-before);
}
```
此时, 第一个System.out.println依旧得到`Test Callable Test Callable`
第二个System.out.println得到结果大约为4000+, 表明运行两次线程只需要4000+毫秒, 即两次线程异步执行不会互相干扰。

ExecutorService继承自Executor，它的目的是为我们管理Thread对象，从而简化并发编程。

除此之外, FutureTask也可以对Callable 异步获得返回值.
```java
public static void main(String[] args) throws Exception {
    Long before = System.currentTimeMillis();
    Callable<String> callable = new Callable<String>(){

        @Override
        public String call() throws Exception {
            Thread.sleep(4000);
            return "Test Callable";
        }
    };
    FutureTask<String> future = new FutureTask<String>(callable);
    new Thread(future).start();
    try {
        Thread.sleep(1000);// 可能做一些事情
        System.out.println(future.get());
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
    
    long after = System.currentTimeMillis();
    System.out.println(after-before);
}
```
FutureTask 实现了Future和Runnable两个接口, 意味着可以同时处理Runnable和Future, 它的好处在于如果有一个返回值计算需要很久, 这个返回值不需要立刻得到, 但线程中其他代码需要被尽快执行的时候, 使用FutureTask, 可以先做其他事, 等到结果计算完了再返回结果。

