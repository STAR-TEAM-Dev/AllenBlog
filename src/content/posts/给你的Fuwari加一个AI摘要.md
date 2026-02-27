---
title: 给你的Fuwari加一个AI摘要
published: 2025-09-08
description: 这篇文章介绍了如何在Fuwari博客中实现自定义AI摘要功能
tags: [AI摘要]
category: AI摘要
draft: false
customSlug: "35"
image: https://cdn.fis.ink/cdn/2025/09/08/68bed408511c5.webp
---
# 预览：本文字上方

# 现在教程开始！

:::caution
修改文件前请注意备份，防止修改失败无法回退
:::

新建src/components/misc/AISummary.astro文件

```astro
---
export interface Props {
  content: string;
}

const { content } = Astro.props;

// 如果没有内容，不渲染组件
if (!content || content.trim() === '') {
  return null;
}
---

{content && (
  <div class="ai-summary">
    <div class="ai-title">
      <div class="ai-title-left">
        <i>🤖</i>
        <span class="ai-title-text">AI 摘要</span>
      </div>
      <div class="ai-tag">fishcpy AI</div>
    </div>
    <div class="ai-explanation" data-content={content}></div>
  </div>
)}

<script>
  // 检查当前页面路径是否包含 "posts"
  function isPostsPage() {
    return window.location.pathname.includes('/posts/');
  }

  // 全局函数，用于初始化AI打字效果
  function initAITyping() {
    // 只在包含 "posts" 的页面才执行AI总结功能
    if (!isPostsPage()) {
      return;
    }

    // 查找所有AI摘要容器
    const aiSummaryContainers = document.querySelectorAll('.ai-summary');
    
    aiSummaryContainers.forEach(container => {
      const textElement = container.querySelector('.ai-explanation');
      
      if (!textElement) {
        return;
      }

      // 检查是否已经初始化过
      if (textElement.hasAttribute('data-initialized')) {
        return;
      }

      const content = textElement.getAttribute('data-content');
      if (!content) {
        return;
      }

      // 标记为已初始化
      textElement.setAttribute('data-initialized', 'true');
      
      // 清空文本内容，准备打字效果
      textElement.textContent = '';
      textElement.classList.remove('typing-complete');
      
      let index = 0;
      const typeSpeed = 30; // 打字速度（毫秒）
      
      function typeWriter() {
        if (index < content.length) {
          textElement.textContent += content.charAt(index);
          index++;
          setTimeout(typeWriter, typeSpeed);
        } else {
          // 打字完成后隐藏光标（通过CSS控制）
          textElement.classList.add('typing-complete');
        }
      }
      
      // 延迟开始打字效果
      setTimeout(typeWriter, 800);
    });
  }

  // 页面加载完成时初始化
  function handlePageLoad() {
    setTimeout(initAITyping, 100);
  }

  // 监听页面导航事件（适用于Astro的客户端路由）
  function setupNavigationListeners() {
    // DOMContentLoaded事件
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handlePageLoad);
    } else {
      handlePageLoad();
    }

    // 监听Astro的页面导航事件
    document.addEventListener('astro:page-load', handlePageLoad);
    
    // 监听浏览器的popstate事件（后退/前进按钮）
    window.addEventListener('popstate', handlePageLoad);
    
    // 监听pushstate和replacestate事件
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(handlePageLoad, 100);
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      setTimeout(handlePageLoad, 100);
    };
  }

  // 立即设置监听器
  setupNavigationListeners();
</script>
```

在src/content/config.ts插入下方代码，13行下左右，注意+号要删除
```ts
tags: z.array(z.string()).optional().default([]),
category: z.string().optional().nullable().default(""),
lang: z.string().optional().default(""),
+		ai: z.string().optional().default(""),

/* For internal use */
prevTitle: z.string().default(""),
```

在src/pages/posts/[...slug].astro插入下方代码，注意+号要删除

```astro
import { profileConfig, siteConfig } from "../../config";
import { formatDateToYYYYMMDD } from "../../utils/date-utils";
import Comment from "@components/comment/index.astro";
+ import AISummary from "@components/misc/AISummary.astro";

export async function getStaticPaths() {
	const blogEntries = await getSortedPosts();
@@ -84,6 +85,9 @@ const jsonLd = {
</div>
</div>

+            <!-- AI Summary -->
+            {entry.data.description && <AISummary content={entry.data.description} class="onload-animation" />}

<!-- metadata -->
<div class="onload-animation">
<PostMetadata
```

在src/styles/main.css底部添加下方代码

```css
/* =================== */
/* 📘 AI 摘要模块样式 */
/* =================== */

.ai-summary {
    background: var(--card-bg);
    border: 1px solid var(--line-divider);
    border-radius: 12px;
    padding: 8px 8px 12px 8px;
    line-height: 1.3;
    flex-direction: column;
    margin-bottom: 16px;
    display: flex;
    gap: 5px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.ai-summary:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
}

.ai-summary .ai-explanation {
    z-index: 10;
    padding: 8px 12px;
    font-size: 15px;
    line-height: 1.4;
    @apply text-90;
    text-align: justify;
}

/* ✅ 打字机光标动画 */
.ai-summary .ai-explanation::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 2px;
    margin-left: 2px;
    @apply bg-black/90 dark:bg-white/90;
    vertical-align: bottom;
    animation: blink-underline 1s ease-in-out infinite;
    transition: all 0.3s;
    position: relative;
    bottom: 3px;
}

/* 打字完成后隐藏光标 */
.ai-summary .ai-explanation.typing-complete::after {
    display: none;
}

.ai-summary .ai-title {
    z-index: 10;
    font-size: 14px;
    display: flex;
    border-radius: 8px;
    align-items: center;
    position: relative;
    padding: 0 12px;
    cursor: default;
    user-select: none;
}

.ai-summary .ai-title .ai-title-left {
    display: flex;
    align-items: center;
    color: var(--primary);
}

.ai-summary .ai-title .ai-title-left i {
    margin-right: 3px;
    display: flex;
    color: var(--primary);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
}

.ai-summary .ai-title .ai-title-left .ai-title-text {
    font-weight: 500;
}

.ai-summary .ai-title .ai-tag {
    color: var(--btn-content);
    font-weight: 300;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

/* ✅ 打字机光标闪烁动画 */
@keyframes blink-underline {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
```

最后在src/styles/variables.styl 大约19行后面添加下方代码

```styl
  --page-bg: oklch(0.95 0.01 var(--hue)) oklch(0.16 0.014 var(--hue))
  --card-bg: white oklch(0.23 0.015 var(--hue))

+  // AI Summary 相关变量
+  --liushen-title-font-color: #0883b7 #0883b7
+  --liushen-maskbg: rgba(255, 255, 255, 0.85) rgba(0, 0, 0, 0.85)
+  --liushen-ai-bg: conic-gradient(from 1.5708rad at 50% 50%, #d6b300 0%, #42A2FF 54%, #d6b300 100%) conic-gradient(from 1.5708rad at 50% 50%, rgba(214, 178, 0, 0.46) 0%, rgba(66, 161, 255, 0.53) 54%, rgba(214, 178, 0, 0.49) 100%)
+  --liushen-card-secondbg: #f1f3f8 #3e3f41
+  --liushen-text: #4c4948 #ffffffb3
+  --liushen-secondtext: #3c3c43cc #a1a2b8

  --btn-content: oklch(0.55 0.12 var(--hue)) oklch(0.75 0.1 var(--hue))
  --btn-regular-bg: oklch(0.95 0.025 var(--hue)) oklch(0.33 0.035 var(--hue))
```

# 样式参考
::link-card{url="https://blog.liushen.fun/posts/40702a0d/" title="清羽飞扬" description="本地实现HEXO文章AI摘要" icon="https://blog.liushen.fun/info/avatar.ico"}