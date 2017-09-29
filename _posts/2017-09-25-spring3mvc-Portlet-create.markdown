---
layout: post
title: Spring Protlet MVC - 使用Spring 3 MVC创建一个基本的websphsere portlet - 野猫
date: 2017-09-25 13:58:12.000000000 +08:00
tags: webshpere portal , SpringMVC Portlet
---

>版权声明：本文为 @WildMeowth
的原创文章, 可以转载, 但请务必注明作者和出处！！！
原文链接：[wildmeowth](http://wildmeowth.github.io/2017/09/spring3mvc-portlet-create/)

## 摘要

本文主要介绍*IBM Websphere Portal*下使用*Spring 3 MVC*创建一个基本的*websphsere portlet*.
* 创建
    - [Portal Project](#0)
* jar包
    - [下载jar包](#1)
* 配置
    - [web.xml](#2.1)
    - [portlet.xml](#2.2)
	- [applicationContext.xml](#2.3)
	- [portletname-portlet.xml](#2.4)

* 源码
    - [代码](#3)

## 正文
<span id="0"></span>
### 0.创建一个Portal Project

打开*Rational Application Developer*, 右键*new*一个新的*Portal Project*. 

[最终目录结构点此跳转.](#jump)
<span id="1"></span>
### 1.下载jar包

首先我们需要下载*Spring 3 MVC*所需要的jar包.
*Spring 3 MVC Portlet* 所需要的*jar*包可以去[spring官网](https://spring.io/)下载.<br>
方便大家下载博主就直接贴出地址如下：[http://repo.spring.io/release/org/springframework/spring](http://repo.spring.io/release/org/springframework/spring)

`org.springframework.asm-3.0.4.RELEASE.JAR`<br>
`org.springframework.beans-3.0.4.RELEASE.JAR`<br>
`org.springframework.context.support-3.0.4.RELEASE.JAR`<br>
`org.springframework.context-3.0.4.RELEASE.JAR`<br>
`org.springframework.core-3.0.4.RELEASE.JAR`<br>
`org.springframework.expression-3.0.4.RELEASE.JAR`<br>
`org.springframework.web.portlet-3.0.4.RELEASE.JAR`<br>
`org.springframework.web.servlet-3.0.4.RELEASE.JAR`<br>
`org.springframework.web-3.0.4.RELEASE.JAR`

将这些*jar*包粘贴到*portal*项目*lib*目录下即可.

### 2.配置文件
<span id="2.1"></span>
#### 2. 1 配置web.xml

和往常一样, *SpringMVCPortlet*一样分别设置*contextConfigLocation*,*ContextLoaderListener*监听器, *ViewRendererServlet*视图渲染解析器. 

全部代码如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app id="WebApp_ID" version="2.5" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
	<display-name>SpringMVCPortlet</display-name>
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>/WEB-INF/context/applicationContext.xml</param-value>
	</context-param>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<servlet>
		<servlet-name>ViewRendererServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.ViewRendererServlet</servlet-class>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>ViewRendererServlet</servlet-name>
		<url-pattern>/WEB-INF/servlet/view</url-pattern>
	</servlet-mapping>
	<welcome-file-list>
		<welcome-file>index.html</welcome-file>
		<welcome-file>index.htm</welcome-file>
		<welcome-file>index.jsp</welcome-file>
		<welcome-file>default.html</welcome-file>
		<welcome-file>default.htm</welcome-file>
		<welcome-file>default.jsp</welcome-file>
	</welcome-file-list>
</web-app>
```
<hr>
<span id="2.2"></span>
#### 2. 2 配置portlet.xml

*Spring Portlet MVC*和其*Web MVC*可以说是如出一辙,只是在*Web MVC*中处于核心的*DispatcherServlet*在*Portlet MVC*中换成了*DispatcherPortlet*.

*DispatcherPortlet*配置在`portlet.xml`文件中,它继承了*Portlet*标准中的*GenericPortlet*,所以它本质上是一个能够将*Portlet Request dispatch*到*Spring*框架中其它*MVC*组件的一个*Portlet*.

创建*portlet*的时候, *RAD*会帮你创建一个*portlet.xml*文件, 我们只需要对其进行一些配置上的修改就可以了.
把其中的```<portlet-class>```标签中的值改成```org.springframework.web.portlet.DispatcherPortlet```

全部代码如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<portlet-app xmlns="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd" version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd" id="com.ibm.catebizpacustomerselectorwar.CatebizpacustomerselectorwarPortlet.87bcccfd63">
	<portlet>
		<description>SpringMVCPortlet</description>
		<portlet-name>SpringMVCPortlet</portlet-name>
		<display-name>SpringMVCPortlet</display-name>
		<display-name xml:lang="en">SpringMVCPortlet</display-name>
		<portlet-class>org.springframework.web.portlet.DispatcherPortlet</portlet-class>
		<init-param>
			<name>wps.markup</name>
			<value>html</value>
		</init-param>
		<expiration-cache>0</expiration-cache>
		<supports>
			<mime-type>text/html</mime-type>
			<portlet-mode>view</portlet-mode>
		</supports>
		<supported-locale>en</supported-locale>
		<resource-bundle>springmvcportlet.nl.HelloWorldPortletResource</resource-bundle>
		<portlet-info>
			<title>SpringMVCPortlet</title>
			<short-title>SpringMVCPortlet</short-title>
			<keywords>SpringMVCPortlet</keywords>
		</portlet-info>
	</portlet>
	<default-namespace>http://springmvcportlet</default-namespace>
</portlet-app>
```
这里以*RenderRequest*处理为例,当*DispatcherPortlet*接收到*Request*的时候,它会根据*handermapping*的配置找到相应的*Controler*来处理请求. *Controler*处理完后返回一个*ModelAndView*,对于*View*的处理则和*Web MVC*类似了,这里不再做介绍.
<hr>
<span id="2.3"></span>
#### 2. 3 创建applicationContext.xml

根据`web.xml`中配置, 在`WEB-INF`下创建一个context文件夹, 在其下创建一个`applicationContext.xml`的文件, 并写好配置.

我们可以在`applicationContext.xml`中设置HandlerMapping,ViewResolver,Controller等，本例中Controller,HandlerMapping在后面的文件中设置。

全部代码如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd">

	<context:annotation-config />
	<!-- Message Source -->
	<bean id="messageSource" class="org.springframework.context.support.ResourceBundleMessageSource">
		<property name="basenames">
			<list>
				<!-- Add appropriate resource properties path -->
				<value>springmvcportlet.nl.HelloWorldPortletResource</value>
			</list>
		</property>
	</bean>
	
	<!-- Default View Resolver -->
	<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="cache" value="true">
		<property name="viewClass">
			<value>org.springframework.web.servlet.view.JstlView</value>
		</property>
		<property name="prefix">
			<value>/WEB-INF/jsp/</value>
		</property>
		<property name="suffix">
			<value>.jsp</value>
		</property>
	</bean>
	
	<!-- Abstract Default Exception Handler -->
	 <bean id="defaultExceptionHandlerTemplate"
		class="org.springframework.web.portlet.handler.SimpleMappingExceptionResolver">
		<property name="defaultErrorView" value="DefaultError" />
		<property name="exceptionMappings">
			<props>
				<prop key="com.ibm.AppException">appError</prop>
			</props>
		</property>
	</bean> 
</bean>
```
<hr>
<span id="2.4"></span>
#### 2. 4 创建SpringMVCPortlet-portlet.xml

根据`portlet.xml`文件中```<portlet-name>```标签中的值（例子中是"SpringMVCPortlet"）+"-portlet.xml"为名字创建此文件, 并配置Controller,HandlerMappings.
全部代码如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p" xmlns:context="http://www.springframework.org/schema/context" xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
	
	<context:annotation-config/>

	<!-- Controllers -->
	<context:component-scan base-package="com.wildMeowth.portal.springmvcportlet.controller" />

	<!-- Handler Mappings -->
	<bean class="org.springframework.web.portlet.mvc.annotation.DefaultAnnotationHandlerMapping"/>
	  
	<!-- Exception Handlers -->
	<bean id="defaultExceptionHandler" parent="defaultExceptionHandlerTemplate"/>
	
</beans>
```

至此, 基本配置完成目录结构如下图: 
<span id="jump">![structure](/assets/images/Bimages/structure.png)</span>
<span id="3"></span>
### 3.代码部分

在`com.wildMeowth.portal.springmvcportlet.controller`包下创建一个类`SpringMVCPortletController`, 在类中写下如下代码: 

```java
@Controller
@RequestMapping("VIEW")
public class CusNameDisplayPortletViewController  {

	@RequestMapping
	public String handleRenderRequestInternal(RenderRequest request, RenderResponse response) throws Exception {

		return "index";
		
	}
}
```

在jsp目录下创建对应的`index.jsp`jsp文件, 如下代码：

```xml
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<h1>Hello World</h1>
```

启动服务器，最终效果如下图:
![effects](/assets/images/Bimages/effects.png)
