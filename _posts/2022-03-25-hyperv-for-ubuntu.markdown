---
layout: post
title: 在windows 自带虚拟化工具hyper-v 下对Ubuntu 虚拟机分辨率的设置
author: 野猫
date: 2022-03-25 20:50:24.000000000 +08:00
tags: 分辨率
categories: hyper-v
type: orginal
---

## 解决方法
1. 进入Ubuntu 后 `vi /etc/default/grub`
2. 将`GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"` 改为 `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyper_fb:1920x1080"`
3. 更新grub 配置 `sudo update-grub`
4. 重启生效

## 过程
最近由于换了新电脑，发现原本使用的虚拟工具virtual box 在新CPU下不是很适配。发现Windows 系统自带hyper-v 也能启动虚拟机的作用。

使用vboxmanager 将原本ova 镜像转为vhd 就能在hyper-v 中管理使用了，愉快。

然而，hyper-v 仅对虚拟机内容为Windows 10的虚拟机有增强效果。。。（可恶，我Windows下还装Windows镜像，不能说鸡肋只能说可惜），于是在Ubuntu中面临的一个问题就是显示分辨率的问题。

导入虚拟机，打开控制台，键入`xrandr` 发现分辨率仅支持1152 x 864。

```
wildmeowth@wildmeowth-VirtualBox:~$ xrandr
xrandr: Failed to get size of gamma for output default
Screen 0: minimum 1152 x 864, current 1152 x 864, maximum 1152 x 864
default connected primary 1152x864+0+0 0mm x 0mm
   1152x864       0.0* 

```

尝试常规的 `vi /etc/profile` 在配置末尾键入（其实就是想要个16:9）

```
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -
xrandr --newmode "1920x1080_60.00"
xrandr --addmode "1152x648_60.00"   59.25  1152 1200 1312 1472  648 651 656 674 -
xrandr --addmode "1152x648_60.00"
```
保存好后跑`source /etc/profile`使其立即生效
加了两个新的16:9 mode，果然还是不行。

最终发现可以通过grub的配置来更新分辨率，操作如置顶。



