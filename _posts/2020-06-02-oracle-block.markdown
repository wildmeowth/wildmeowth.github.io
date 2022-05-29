---
layout: post
title: 记一次负载测试中出现select for update悲观锁产生的问题
author: 野猫
date: 2020-06-02 12:43:11.000000000 +08:00
tags: Oracle
categories: Database
---

在一次release 开发过程中, QA team 在做load test 的时候 发现许多库存预存的请求报错。

db发现有 row lock 的提醒， 技术支持查看Oracle报告时发现另一个release order to dbs(订单release到dbs的系统)的接口中用到了select for update 语句

## 以下是当时的业务逻辑

1. The agent `CatChinaReleaseOrderAgent` start a
A series of tasks are executed include the `FOR UPDATE` SQL and `CATPubRelOrdToIIBSyncService` 
2. ` CATPubRelOrdToIIBSyncService ` will connect to IIB MQ with LDAP username and password. 
3. Something wrong with LDAP service and it may cost a lot of time to connect to IIB MQ. 
4. ` CATPubRelOrdToIIBSyncService ` will be blocked, and `FOR UPDATE` will be blocked, so it impact the  `SCWC_SDF_reserveAvailableInventory` API. 

由于一个事务中使用了`select for update`, 同一个事务中的另一个同步服务去连接IIB MQ的时候， 由于外部系统网络缓慢，花费了很长的时间连接, `for update` 长时间row lock. 这时候如果有其他服务调用相同数据，会被长时间阻塞。

## 解决方案
事实上技术中心不允许使用 select for update 悲观锁，尤其是在大量业务逻辑的情况下，至于原有业务逻辑可以使用其他处理方案进行替代。如必须使用 select for update，须与架构部讨论后才可使用。

但由于本案例中的`FOR UPDATE` 语句所在代码属于IBM 提供的OOTB 代码, 不适合修改， 于是考虑将`FOR UPDATE` 同一个事务中的后续同步服务改成异步服务， 让它成为新的事务, 不干扰原本事务, 减少`FOR UPDATE` 占用时间。本案中将`CATPubRelOrdToIIBSyncService` 同步改成了  `CATPubRelOrdToIIBAsyncService`异步服务。
