---
layout: post
title: "Jekyll build static blog"
date: 2015-02-15 22:14:54
categories: jekyll
tags: jekyll RubyGems
---

* content
{:toc}

I've always wanted to build my own blog, but I've been too busy doing projects in the last six months, plus the network in the faculty is very dodgy, so I haven't been able to care. Before, I used WordPress hosted on the free Jingdong Cloud Prime, but the speed was too slow. I saw some related content on Zhihu, so I chose to build a blog on github with jekyll.





## Build process

In jekyll's official website [http://jekyllrb.com/](http://jekyllrb.com/) actually has been said to be more understandable, I'd better briefly say it here. I am using Windows system.    
The main links are: install Ruby, install RubyGems, install jekyll, install code highlighting plugin, install node.js

### Install Ruby

ruby official website to download and install: [https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/)

Configure environment variables after installation is complete

In the command prompt, get the ruby version number, as follows, that is, the installation is successful

! [](http://ww4.sinaimg.cn/large/7011d6cfjw1f2ue0e393vj20cu00t748.jpg)

### Install RubyGems

Download [http://rubygems.org/pages/download](http://rubygems.org/pages/download) rubygems-2.4.5.zip from the official website   

cd to RubyGems directory   

! [](http://ww1.sinaimg.cn/large/7011d6cfjw1f2ue1l2yscj20gk02amxj.jpg)

Execute the installation   

! [](http://ww1.sinaimg.cn/large/7011d6cfjw1f2ue1w8eqnj20bx00hglg.jpg)  

### Install Jekyll with RubyGems

Execute the following statement to install   

! [](http://ww4.sinaimg.cn/large/7011d6cfjw1f2ue2g2p3uj207x00ft8j.jpg)

End of installation screen   

! [](http://ww4.sinaimg.cn/large/7011d6cfjw1f2ue32drwhj20hv09xq5m.jpg)

At this point jekyll has been installed, the subsequent is to personalize their own settings.

### Create a blog

Create a new workspace jekyllWorkspace in the d drive

cd to jekyllWorkspace   

Execute jekyll new name to create a new workspace   

! [](http://ww3.sinaimg.cn/large/7011d6cfjw1f2ue3lt31nj20cj02nt8u.jpg)

The file structure is as follows:   

! [](http://ww1.sinaimg.cn/large/7011d6cfjw1f2ue3ujsybj20ek06wabh.jpg)

cd to the blog folder and open the server   

! [](http://ww1.sinaimg.cn/large/7011d6cfjw1f2ue47y9lgj20ao00f0sl.jpg)

watch in order to detect changes in the folder, i.e. no need to restart jekyll after changes

My environment starts with an error (yours may not), then install yajl-ruby and rouge  

! [](http://ww4.sinaimg.cn/large/7011d6cfjw1f2ue4nelnxj20dd077q49.jpg)

Start the server again successfully

! [](http://ww4.sinaimg.cn/large/7011d6cfjw1f2ue4v42koj20g505bdgy.jpg)

Visit http://localhost:4000/   

! [](http://ww1.sinaimg.cn/large/7011d6cfjw1f2ue56ckwoj20je0eumz3.jpg)

Detailed article page   

! [](http://ww2.sinaimg.cn/large/7011d6cfjw1f2ue5f3j9cj20je0gyq7a.jpg)

## Follow up

* The whole installation process refers to the jekyll official website, note that jekyll also has an official website in simplified Chinese, but more pit (I was pitted), some content is not translated over, there may be a detour, it is recommended that if you want to read the relevant information in Chinese, you should also read in Chinese and English. [jekyll中文网 http://jekyllcn.com](http://jekyllcn.com), [jekyll英文网 http://jekyllrb.com](http://jekyllrb.com)
* The css in jekyll is written in sass, of course it's okay to add css directly in `_sass/_layout.scss`.
* This article is written in Markdown format, the related syntax can be referred to: [Markdown Syntax Description (Simplified Chinese Version) http://wowubuntu.com/markdown/](http://wowubuntu.com/markdown/)  
* After building the blog according to the instructions in this article, you can see it when you host it with `github Pages`. Note, it seems that rouge is not supported on top of github, so to push to github, I change the code highlighting in the configuration file _config.yml to `highlighter: pygments` on it
* The default blog is no comment system, this article's comment system uses more than say, detailed installation methods can visit [more say official website http://duoshuo.com/](http://duoshuo.com/), of course, you can also use [sohu smooth talk http://changyan.sohu.com/](http://) changyan.sohu.com/) as a commenting system.
* You can also bind your own domain name, if you don't have a domain name, you can put it in your shopping cart on [godaddy http://www.godaddy.com/](http://www.godaddy.com/) and wait for the price to drop, buy it.
* Happy New Year to all of you!

---

## Possible problems

### `hitimes/hitimes (LoadError)`

** Error code:**

```
C:/Ruby22/lib/ruby/2.2.0/rubygems/core_ext/kernel_require.rb:54:in `require': cannot load such file -- hitimes/hitimes (LoadError)
```

**Solution:**

Another good workaround on stackoverflow. [hitimes require error when running jekyll serve on windows 8.1](http://stackoverflow.com/questions/28985481/hitimes-require-error-when- running-jekyll-serve-on-windows-8-1) Although the question above is about the situation under win 8.1, it also applies to win 7. Here I'll briefly translate the cause of the error and the solution.

> There may be some ABI changes in Ruby 2.2 and hitimes-1.2.2-x86-mingw32, and some related libraries are missing.
>
> So uninstall hitimes and reinstall it with `--platform ruby`. The code is as follows:

```
gem uni hitimes
**Remove ALL versions**
gem ins hitimes -v 1.2.1 --platform ruby
```

> Then hitimes will be automatically recompiled and applied to Ruby 2.2

Here is my own uninstall and install process:

```
E:\GitWorkSpace\gaohaoyang.github.io>gem uni hitimes

You have requested to uninstall the gem.
        hitimes-1.2.2-x86-mingw32

timers-4.0.1 depends on hitimes (>= 0)
If you remove this gem, these dependencies will not be met.
Continue with Uninstall? [yN] y
Successfully uninstalled hitimes-1.2.2-x86-mingw32

E:\GitWorkSpace\gaohaoyang.github.io>gem ins hitimes -v 1.2.1 --platform ruby
Fetching: hitimes-1.2.1.gem (100%)
Temporarily enhancing PATH to include DevKit...
Building native extensions. This could take a while...
Successfully installed hitimes-1.2.1
Parsing documentation for hitimes-1.2.1
Installing ri documentation for hitimes-1.2.1
Done installing documentation for hitimes after 1 seconds
1 gem installed
```


About, [hitimes](https://rubygems.org/gems/hitimes/versions/1.2.2) is a fast and efficient timer solution library, you can check the official website for details.


Translated with www.DeepL.com/Translator (free version)