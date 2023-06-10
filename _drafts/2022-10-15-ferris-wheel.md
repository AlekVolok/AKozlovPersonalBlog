---
layout: post
title: "Ferris wheel animation implementation revealed"
categories: JavaScript
tags: Animation
author: HyG
---

* content
{:toc}

The implementation of the Ferris wheel animation is revealed

![](https://gw.alicdn.com/imgextra/i2/O1CN01WMJfsa23yty2Z4YOn_!!6000000007325-1-tps-600-329.gif)

It so happens that a Ferris wheel animation like this was recently developed for business, so I'll share the implementation principle with you. The Ferris wheel animation is mainly divided into 2 parts, one is the layout of each room on the Ferris wheel, and the other is the rotation animation.





# Ferris wheel layout

We need to layout each carriage evenly on a circle, which requires some knowledge of trigonometry.

With the center of the circle as the origin and the radius r, the coordinates of the 1st vertex of a positive polygon are `(rcosθ, rsinθ)`, where `θ` can be thought of as `360/number of polygon sides`. The coordinates of the 2nd vertex are `(rcos2θ, rsin2θ)`, as follows

! [](https://gw.alicdn.com/imgextra/i1/O1CN01vucWNA1GKg0lvyXPs_! !6000000000604-2-tps-807-585.png)

Note also that JavaScript uses the radian system, not the angle, so we need to convert

`degree2Radian.ts`

``js
/**
 * angle to radian
 * @param radius angle
 * @returns radius
 */
const getRadian = (radius: number) => (radius * Math.PI) / 180

export default getRadian
```

The coordinates of each vertex are positioned as follows

```js
import degree2Radian from '. /degree2Radian'

/**
 * Get the position
 * @param r radius
 * @param count number
 */
const getPos = (r: number, count: number) => {
  const angleRadian = degree2Radian(360 / count)
  const res: Array<{
    x: number
    y: number
  }> = []
  for (let i = 0; i < count; i += 1) {
    res.push({
      x: r * Math.cos(angleRadian * i).
      y: r * Math.sin(angleRadian * i).
    })
  }
  return res
}

export default getPos
```

Let's try to use it to render

{% raw %}
```jsx
<div className={styles.ferris}>
  <div className={styles.wheel} ref={wheelDomRef}>
    <div className={styles.roomsArea}>
      {
        getPos(202 / 2, 8).map((item, index) => (
          <div
            key={index}
            className={`${styles.rooms} wheelRooms`}
            style={{
              top: `${item.y}px`,
              left: `${item.x - 20}px`,
            }}
          />
        ))
      }
    </div>
  </div>
  <div className={styles.bottom} />
</div>
```
{% endraw %}

注意 left 值，我们减去了自身宽度的一半保证居中

![](https://gw.alicdn.com/imgextra/i4/O1CN01Whjysk1U1oJbwgmcm_! !6000000002458-2-tps-756-420.png)

我们可以通过控制 UI 来设置多个车厢，验证没有问题。

![](https://gw.alicdn.com/imgextra/i4/O1CN01YbapA224kX9sxhCZh_! !6000000007429-1-tps-600-354.gif)

# 摩天轮旋转动画

接下来我们看看动画部分，这里动画的可以拆解为2部分，一个是主轮的旋转，另一个是周围的车厢要同步反向旋转。 如下图

![](https://gw.alicdn.com/imgextra/i1/O1CN01cMfM4F1yTEVAdKWjz_! !6000000006579-2-tps-538-549.png)

这里我们使用 anime.js 这个动画库来实现

使用 anime 动画库的原因是：
- 代码简洁，api完善，便于控制暂停播放
- 时间线 api，保证2部分动画同步
- 适配高刷屏，不会出现倍速问题
- anime.js 很小，17k，gzip后8.2k

The core code is as follows, you can see the code is really very simple.

```js
this.timeline = anime.timeline({
  easing: 'linear'.
  duration: 8000.
  loop: true.
  autoplay: autoPlay.
})
this.timeline
  .add({
    targets: this.wheelDom.
    rotate: 360.
  })
  .add(
    {
      targets: this.roomsDoms.
      rotate: -360.
    }.
    0.
  )
```

We have used the timeline api to rotate the big wheel and the carriage in opposite directions.

And be careful to set the top middle of the carriage to be the center of the rotation circle, to have a kind of suspension.

```css
transform-origin: top center.
```

Add some animation control functions, such as stop, play, reverse, reset, etc., which may be useful in a production environment, for example, when the page scrolls outside the viewable area, or when a popup pops up on the page, we can pause the animation to improve the performance of the page when it runs.

The final demo

![](https://gw.alicdn.com/imgextra/i1/O1CN01vMIISX1GHvdQCHvsB_! !6000000000598-1-tps-500-281.gif)

Can be scanned to access

![](https://gw.alicdn.com/imgextra/i1/O1CN01g3TIqr1SEySyIIqeC_! !6000000002216-2-tps-200-200.png)

Online [demo link](https://gaohaoyang.github.io/demos/#/FerrisWheel)

[demo source code](https://github.com/Gaohaoyang/demos/tree/main/src/FerrisWheel)

Finally, a screenshot of the production environment reference is attached, it's nice, right?

![](https://gw.alicdn.com/imgextra/i2/O1CN01yfrf7X1yNHM49XI9g_! !6000000006566-1-tps-320-398.gif)

# Summary

This article mainly analyzes how to develop a Ferris wheel animation, including the layout of the Ferris wheel carriage and rotation animation part, review a little trigonometric knowledge, and create a very good animation effect ~
