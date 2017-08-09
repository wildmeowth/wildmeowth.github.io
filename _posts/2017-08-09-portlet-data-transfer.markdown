---
layout: post
title: websphere portlet间数据传递 - 野猫
date: 2017-08-09 16:43:31.000000000 +08:00
---

>版权声明：本文为 @WildMeowth
的原创文章，可以转载，但请务必注明作者和出处！！！
原文链接：[wildmeowth.github.io](http://wildmeowth.github.io/2017/08/portlet-data-transfer/)

## 摘要

本文主要介绍IBM websphere portal中多个portlet间的数据交互。博主仅介绍其中两种。

## 正文

### 1.共享呈现参数

对于共享呈现参数需要在 portlet.xml 部署文件中的<portlet-app>中使用 <public-render-parameter> 标签。

for example:
```
<portlet-app ...>
    <portlet>
        <portlet-name>Portlet A</portlet-name>
    ...
    </portlet>
    ...
	<public-render-parameter>
        <identifier>param1</identifier>
        <qname xmlns:x="http://sun.com/params">x:param1</qname>
    </public-render-parameter>
    <public-render-parameter>
        <identifier>param2</identifier>
        <qname xmlns:x="http://sun.com/params">x:param2</qname>
    </public-render-parameter>
</portlet-app>
```

然后在每个 <portlet> 中使用 <supported-public-render-parameter> 标签。

for example:
```
<portlet>
    <portlet-name>Portlet B</portle-name>
    ......
    <supported-public-render-parameter>param1</supported-public-render-parameter>
</portlet>    
 
<portlet>
    <portlet-name>Portlet C</portle-name>
    ......
    <supported-public-render-parameter>param2</supported-public-render-parameter>
</portlet>
```


共享呈现参数的使用
与非共享呈现参数的使用方法相同，共享呈现参数可以通过 ActionResponse 的 setRenderParameter("key","value") 方法设定，并通过 RenderRequest 的 getParameter("key") 来获得。

for example:
Portlet A 设定共享呈现参数
```
public void processAction(ActionRequest actionRequest,
        ActionResponse actionResponse) throws PortletException, IOException {
    String publicValue = actionRequest.getParameter("param1");
    actionResponse.setRenderParameter("param1", publicParam);
}
```

Portlet B 获取共享呈现参数
```
public void render(RenderRequest renderRequest,
        renderResponse renderResponse) throws PortletException, IOException {
    ...
    String publicValue = renderRequest.getParameter("param1")；
    ...
}
```

以上DONE。

### 2.PortletSession

PortletSession在应用级即PortletSession.APPLICATION_SCOPE，可以在多个portlet间进行数据共享。

for example:
```
Portlet A 中：
String data = "Don't worry, be happy!";
PortletSession session = request.getPortletSession().setAttribute("data", data, PortletSession.APPLICATION_SCOPE);

Portlet B 中：
```
String data= (String) request.getPortletSession().getAttribute("data",PortletSession.APPLICATION_SCOPE);
```



以上就是在IBM websphere portal中多个portlet间的数据交互的两种方法。


