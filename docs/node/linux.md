# pm2

[PM2中文网](https://pm2.fenxianglu.cn/)

作用：管理node进程，简化node管理任务。

优点：
- 后台运行
- 停机重载
- 控制台检测
- 提供 http api
- 内建负载均衡（基于node cluster模块）
- 自动停止不稳定进程，避免无限循环
- 提供远程的事实api服务（node模块允许pm2进程管理器交互）

## 初步了解

常用命令：
```
>> mkdir xxx 创建文件夹
>> echo >xxx.js 创建xxx文件
>> ls 查看当前目录
>> dir 查看当前目录
```

1. 初始化环境 `npm init`或者`npm init -y`，生成 package.json
2. 初始化环境 `npm init -y`
3. 安装依赖 `cnpm install express`、`cnpm install pm2 -g`
4. 验证pm2 `pm2 -v`
5. 使用pm2启动node服务 `pm2 start index.js`,如下既是启动成功

```powershell
PS C:\Users\junnian\Desktop\pm2_demo> pm2 start indexindex.js
[PM2] Starting C:\Users\junnian\Desktop\pm2_demo\index5000.js in fork_mode (1 instance)[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ index              │ fork     │ 0    │ online    │ 0%       │ 27.4mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
PS C:\Users\junnian\Desktop\pm2_demo> pm2 start index8000.js
```

pm2常用命令：
- `pm2 start index.js` 启动index.js进程
- `pm2 start index.js --watch` 启动index.js进程并监听，会即时重启服务
- `pm2 list` 查看当前管理进程
- `pm2 log` 查看当前日志
- `pm2 stop id` 停止指定id进程
- `pm2 restart id` 重新启动指定id进程
- `pm2 delete id` 删除指定id进程

补充：VSCODE终端无法运行脚本的解决方式：
```powershell
PS C:\Windows\system32> get-ExecutionPolicy
Restricted
PS C:\Windows\system32> set-ExecutionPolicy;

位于命令管道位置 1 的 cmdlet Set-ExecutionPolicy
请为以下参数提供值:
ExecutionPolicy: RemoteSigned

执行策略更改
执行策略可帮助你防止执行不信任的脚本。更改执行策略可能会产生安全风险，如 https:/go.microsoft.com/fwlink/?LinkID=135170
中的 about_Execution_Policies 帮助主题所述。是否要更改执行策略?
[Y] 是(Y)  [A] 全是(A)  [N] 否(N)  [L] 全否(L)  [S] 暂停(S)  [?] 帮助 (默认值为“N”): Y
PS C:\Windows\system32> get-ExecutionPolicy
RemoteSigned
```

## 关于服务器 Linux

在线云服务推荐：[阿里云](https://cn.aliyun.com/)、[腾讯云](https://cloud.tencent.com/)等

管理Linux服务器或者进行向服务器传文件时，需要使用ssh客户端连接到服务器，使用Mac或者Linux桌面系统可以直接使用SSH命令，windows系统需要额外安装工作支持，推荐：[Xshell](https://www.xshell.com/zh/xshell/)或者[OpenSSH](https://www.openssh.com/portable.html#downloads)、[Git]()

使用SSH连接linux服务器（准备好账户、密码和公网地址）: `ssh username@ip`，如下：按要求输入密码并选择是否保存SSH密钥，即可进入服务器：
```powershell
Microsoft Windows [版本 10.0.19045.2673]
(c) Microsoft Corporation。保留所有权利。

C:\Users\junnian>ssh root@47.108.233.39
The authenticity of host '47.108.233.39 (47.108.233.39)' can't be established.
ECDSA key fingerprint is SHA256:ygmvjM7zUYovESAq8biGYVOLwD3Wn2KqPkG7Uz6AOe8.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '47.108.233.39' (ECDSA) to the list of known hosts.
root@47.108.233.39's password:
Last failed login: Thu Mar  9 19:12:03 CST 2023 from 27.227.244.45 on ssh:notty
There were 2 failed login attempts since the last successful login.

Welcome to Alibaba Cloud Elastic Compute Service !

[root@iZ2vcc0d34kg5yk3n27ekyZ ~]#
```

Linux 常用命令
```linux
> ls 查看当前文件夹下所有文件
> pwd 查看当前文件夹
> cd .. 切换到上一级文件夹
> cd ~  切换到家目录（刚进入系统的那个目录）
> cd /  切换到根目录文件夹
> wget https://nodejs.org/dist/v18.15.0/node-v18.15.0-linux-x64.tar.xz 下载指定文件
> tar -xf node-v18.15.0-linux-x64.tar.xz 解压指定文件
> $PATH 查看环境变量（冒号分隔）
> vi xxx 使用vim编辑器打开当前目录指定文件

> mkdir xxx 新建指定文件夹
> touch index.js 新建index.js文件 

> rm -f xxx 删除一个xxx文件
> rmdir xxx 删除一个xxx目录
> rm -rf xxx 删除一个xxx目录并同时删除其内容 
```

使用`wget url`命令安装 [node.js Linux 版](https://nodejs.org/en/download/) 二进制文件，Linux中使用鼠标右键粘贴内容。下载完成使用`tar -xvf node-v18.15.0-linux-x64.tar.xz`解压文件，并进入`/node-v18.15.0-linux-x64/bin`这个目录使用`ls`查看是否存在corepack  node  npm  npx文件，文件存在就使用`pwd`命令得到当前文件目录。

进入`/etc`目录，使用vim编辑器（i开启编辑模式,esc退出当前模式，`:wq`保存并退出编辑器）打开profile文件`vi profile`，添加`export PATH=$PATH:/node-v18.15.0-linux-x64/bin`一行，使用`source profile`刷新当前shell环境，然后退出当前服务器`exit`并重新登录，使用`node -v`、`npm -v`查看当前node版本。

在根文件使用mkdir新建node-server文件，并在此文件内新建server文件...

完成后使用 pm2 启动node服务，需要注意，此时需要在阿里云安全组配置面板中添加防火墙规则，将node服务端口开放暴露出去。

使用`pm2 monit`即可监听node服务日志

## Linux系统文件属性

`ls -l`（可简写为`ll`）即可查看当前文件夹下所有文件属性

第一列表示文件属性和权限列：首字母：-代表文件,d代表文件夹，l表示超链接，c表示硬件，b表示u盘等移动存储设备。首字母后的所有字母则每三个划分为一组，共三组，分别表示的创建者权限（读、写、可执行），所在用户组权限（读、写、可执行）和其他用户权限（读、写、可执行），如果有下划线，则表示该权限缺失（如目录不可执行，则执行权限全部为_）。

第二列表示文件数量，第三列表示用户名，第四列表示组名，第五列表示文件体积，第六列表示文件创建日期，第六列为文件名。

示例：
```linux
[root@iZ2vcc0d34kg5yk3n27ekyZ /]# ll
total 21964
lrwxrwxrwx.  1 root root        7 Feb  8 10:15 bin -> usr/bin
dr-xr-xr-x.  5 root root     4096 Feb  8 10:38 boot
drwxr-xr-x  19 root root     2960 Mar  9 19:10 dev
drwxr-xr-x. 80 root root     4096 Mar 10 03:02 etc
drwxr-xr-x.  2 root root     4096 Apr 11  2018 home
lrwxrwxrwx.  1 root root        7 Feb  8 10:15 lib -> usr/lib
lrwxrwxrwx.  1 root root        9 Feb  8 10:15 lib64 -> usr/lib64
drwx------.  2 root root    16384 Feb  8 10:15 lost+found
drwxr-xr-x.  2 root root     4096 Apr 11  2018 media
drwxr-xr-x.  2 root root     4096 Apr 11  2018 mnt
drwxr-xr-x   3 root root     4096 Mar 10 03:42 node-server
drwxr-xr-x   6 1001 1001     4096 Aug 16  2022 node-v16.17.0-linux-x64
-rw-r--r--   1 root root 22419468 Aug 16  2022 node-v16.17.0-linux-x64.tar.xz
[root@iZ2vcc0d34kg5yk3n27ekyZ /]#
```

## Linux权限

新建文件`touch index.txt`

使用`adduser username`新建账户，使用`passpwd username`为账户指定密码

此时使用新建账户登录并尝试修改此文件时，会报错：无权限，且使用`ll`查看文件属性也会发现没有权限，如下：
```
[junnian@iZ2vcc0d34kg5yk3n27ekyZ /]$ echo change>index.txt
-bash: index.txt: Permission denied
[junnian@iZ2vcc0d34kg5yk3n27ekyZ /]$ ll
total 21968
-rw-r--r--    1 root root        6 Mar 10 11:35 index.txt
[junnian@iZ2vcc0d34kg5yk3n27ekyZ /]$ echo change>index.txt
```

此时需要到root账户下使用`chmod`命令为文件指定权限：`[root@iZ2vcc0d34kg5yk3n27ekyZ /]# chmod 777 index.txt`，回到新建账户尝试修改文件，已经可以正常读写文件了:
```
[junnian@iZ2vcc0d34kg5yk3n27ekyZ /]$ echo change>index.txt
[junnian@iZ2vcc0d34kg5yk3n27ekyZ /]$ cat index.txt
change
```
关于`chmod`命令可以参考这篇文章:[Linux chmod命令](https://www.runoob.com/linux/linux-comm-chmod.html)


## 了解Nignx

Nignx是使用c开发的一个高性能http服务器，支持正反向代理（正向代理服务器，反向代理客户端）、负载均衡（轮询+权重），动静分离等特性。并且官方测试最高支持50,000个并发连接响应。

### 安装Nignx方式1（简单）

使用：`yum install nignx`即可

### 安装Nignx方式2（自行搭建安装环境）
补充：yum类似与node中的npm包管理工具

1. 安装gcc环境，`[root@iZ2vcc0d34kg5yk3n27ekyZ ~]# yum install gcc-c++`
2. 安装PCRE pcre-devel（基于pcre的二次开发库），nginx的http模块使用pcre来解析正则表达式。`yum install -y pcre pcre-devel`
3. 安装 zlib 库，提供多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip 。`yum install -y zlib zlib-devel`
4. 安装 OpenSSL，一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。`yum install -y openssl openssl-devel`
5. 下载Nginx，`wget https://nginx.org/download/nginx-1.19.9.tar.gz `
6. 解压nginx，`tar -zxvf nginx-1.19.9.tar.gz`
7. 执行nginx/configure文件
8. 编译文件会生成MakeFile文件夹，`make`。编译完成之后安装，`make install`
9. 查询nginx安装位置，`whereis nginx`
10. 进入安装位置并执行nginx
11. 将nginx加入环境变量，`/user/local/nginx/sbin`,重启服务器

现在尝试访问服务器80端口，需要提前开启80端口防火墙。

## nginx常用命令

```
nginx -v
nginx 启动nginx
ps -ef 查看当前系统所有进程
ps -ef | grep nginx 查看当前系统所有进程，并找出nginx进程
nginx -s stop 停止进程
nginx -s quit 停止进程（优雅停止）
nginx -s reload 重载nginx配置文件,刷新nginx缓存（nginx.conf）
nginx -t 检查nginx.conf是否有语法错误，会同时暴露nginx.conf地址
```

补充nginx.conf:
- 全局块：（user：指定用户/用户组（windows不支持）；worker_processes：配置nginx进程；error-log：错误日志；pid文件）
- events块：（accept_mutex:优化werker串行处理，默认开启；worker_connections:单个进程最大连接数）
- http块
    - server块（可以存在多个）
        - listen（指定监听端口/IP） 
        - location块（匹配模式，支持正则）
    - include块（引入其它配置）
    - sendfile块（减少静态系统切换）
    - log_format块（日志处理）
    - gzip（开启gzip压缩）

## nginx 反向代理

如需要访问:http://47.108.233.39:5001/api/list服务，则nginx配置文件修改如下，80端口代理到指定域名：
```config
http {
    server: {
        listin 80;
        location /api { ## /api请求均会被转发到代理服务器
            proxy_pass http://47.108.233.39:5001/;
        }
    }
}
```
使用`nginx -s reload`刷新nginx服务，即可尝试访问。

## Vue项目 history模式下路由刷新404

问题描述：当Vue项目使用了history模式时，路由跳转后刷新出现404。

原因：服务器是根据页面url寻找资源的。但vue项目是单页面应用，打包好的web站点只有一个html页面，不存在其他资源目录下的html，服务器找不到对应页面所以报404。

解决方案:根路径下配置如下：
```
server {
    loaction / {
        try_files $uri $uri/ /index.html;
    }
}
```
这句命令的意思是如果给出的file都没有匹配到，则重新请求最后一个参数给定的uri，就是新的location匹配。

## 添加日志分析工具

P.S. 执行`try_files $uri $uri/ /index.html;`并重启即可将Linux命令提示设置为中文

GoAccess是一款开源、实时，运行在命令行终端下的web日志分析工具。该工具提供快速、多样的HTTP状态统计，可以令管理员不再纠结于统计各类数据，和繁杂的指令以及一大堆管道/正则表达式。

[GoAccess 操作手册](https://www.goaccess.cc/?mod=man),依照文档下载安装即可
```
$ wget http://tar.goaccess.io/goaccess-1.2.tar.gz
$ tar -xzvf goaccess-1.2.tar.gz
$ cd goaccess-1.2/
$ ./configure
$ make
# make install
```
安装完成后,就可以全局使用`goaccess`命令了，此时进入nginx/logs/access.log文件，常规方式是使用`cat access.log`,安装成功goaccess后，则可以使用`goaccess -f access.log`,选择格式化模式即可格式化查看

注意：make命令可能会报错:`configure: error: *** Missing development libraries for ncurses`。解决方式：根目录运行`yum -y install ncurses-devel`命令，安装ncurses-devel库即可

## Nginx 负载均衡

Nginx 负载均衡共有三种方式：
- 轮询方式负载（默认）
- 负载权重分配
- 负载超时分配

默认负载：
```nginx.conf
http {

    upstream node {
        server 47.108.233.39:5000;
        server 47.108.233.39:5001;
        server 47.108.233.39:5003;
    }

    server {
        listen       80;
        server_name  localhost;
        location / {
                # root   html;
                # index  index.html index.htm;
                proxy_pass http://node;
        }
    }
}
```

按照权重weight 配置负载（权重与负载成正比关系，权重越大服务器承载的并发就越高）：
```nginx.conf
upstream node {
    server 47.108.233.39:5000 weight=3;
    server 47.108.233.39:5001 weight=2;
    server 47.108.233.39:5003 weight=1;
}
```

按照故障等待超时时间fail_timeout backup，配置负载（backup是备用服务器参数，可以为一个upstream设置一个backup的server，在生产server全部都出问题之后，可以自动切换到备用server上，为回复服务争取时间）
```
upstream  node {
    server 47.108.233.39:5000 fail_timeout=60;
    server 47.108.233.39:5001 fail_timeout=20;
    server 47.108.233.39:5003 backup;
}
```