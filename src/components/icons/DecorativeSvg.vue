<!-- 装饰性 SVG 元素组件 -->
<template>
  <svg
    :class="[
      'decorative-svg',
      `decorative-svg--${type}`,
      {
        'decorative-svg--animated': animated,
      },
    ]"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :style="svgStyles"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 背景装饰图案 -->
    <g v-if="type === 'background-pattern'">
      <!-- 几何网格 -->
      <defs>
        <pattern
          id="grid-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            :stroke="color"
            stroke-width="1"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </g>

    <!-- 分割线元素 -->
    <g v-else-if="type === 'divider'">
      <!-- 简单分割线 -->
      <line
        v-if="variant === 'simple'"
        x1="0"
        :y1="height / 2"
        :x2="width"
        :y2="height / 2"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
      
      <!-- 装饰性分割线 -->
      <g v-else-if="variant === 'decorative'">
        <line
          x1="0"
          :y1="height / 2"
          :x2="width * 0.4"
          :y2="height / 2"
          :stroke="color"
          :stroke-width="strokeWidth"
        />
        <circle
          :cx="width / 2"
          :cy="height / 2"
          :r="4"
          :fill="color"
        />
        <line
          :x1="width * 0.6"
          :y1="height / 2"
          :x2="width"
          :y2="height / 2"
          :stroke="color"
          :stroke-width="strokeWidth"
        />
      </g>

      <!-- 波浪分割线 -->
      <path
        v-else-if="variant === 'wave'"
        :d="`M 0 ${height / 2} Q ${width / 4} ${height / 4} ${width / 2} ${height / 2} T ${width} ${height / 2}`"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
      />
    </g>

    <!-- 边框元素 -->
    <g v-else-if="type === 'border'">
      <!-- 简单边框 -->
      <rect
        v-if="variant === 'simple'"
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :rx="borderRadius"
      />

      <!-- 装饰性边框 */
      <g v-else-if="variant === 'decorative'">
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="none"
          :stroke="color"
          :stroke-width="strokeWidth"
          :rx="borderRadius"
        />
        <!-- 角落装饰 -->
        <circle :cx="10" :cy="10" r="3" :fill="color" />
        <circle :cx="width - 10" :cy="10" r="3" :fill="color" />
        <circle :cx="10" :cy="height - 10" r="3" :fill="color" />
        <circle :cx="width - 10" :cy="height - 10" r="3" :fill="color" />
      </g>

      <!-- 虚线边框 -->
      <rect
        v-else-if="variant === 'dashed'"
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="dashArray"
        :rx="borderRadius"
      />
    </g>

    <!-- 几何装饰图形 -->
    <g v-else-if="type === 'geometric'">
      <!-- 三角形 -->
      <polygon
        v-if="variant === 'triangle'"
        :points="`${width / 2},10 10,${height - 10} ${width - 10},${height - 10}`"
        :fill="color"
        :opacity="opacity"
      />

      <!-- 六边形 -->
      <polygon
        v-else-if="variant === 'hexagon'"
        :points="getHexagonPoints()"
        :fill="color"
        :opacity="opacity"
      />

      <!-- 圆形 -->
      <circle
        v-else-if="variant === 'circle'"
        :cx="width / 2"
        :cy="height / 2"
        :r="Math.min(width, height) / 2 - 10"
        :fill="color"
        :opacity="opacity"
      />

      <!-- 菱形 -->
      <polygon
        v-else-if="variant === 'diamond'"
        :points="`${width / 2},10 ${width - 10},${height / 2} ${width / 2},${height - 10} 10,${height / 2}`"
        :fill="color"
        :opacity="opacity"
      />
    </g>

    <!-- 品牌标识和 Logo -->
    <g v-else-if="type === 'logo'">
      <!-- 简单 Logo -->
      <g v-if="variant === 'simple'">
        <circle
          :cx="width / 2"
          :cy="height / 2"
          :r="Math.min(width, height) / 3"
          :fill="color"
        />
        <text
          :x="width / 2"
          :y="height / 2 + 5"
          text-anchor="middle"
          :fill="textColor"
          font-family="Arial, sans-serif"
          font-weight="bold"
          :font-size="fontSize"
        >
          {{ logoText }}
        </text>
      </g>

      <!-- 复杂 Logo -->
      <g v-else-if="variant === 'complex'">
        <rect
          x="10"
          y="10"
          :width="width - 20"
          :height="height - 20"
          :fill="color"
          :rx="5"
        />
        <text
          :x="width / 2"
          :y="height / 2 + 5"
          text-anchor="middle"
          :fill="textColor"
          font-family="Arial, sans-serif"
          font-weight="bold"
          :font-size="fontSize"
        >
          {{ logoText }}
        </text>
      </g>
    </g>

    <!-- 默认装饰元素 -->
    <g v-else>
      <circle
        :cx="width / 2"
        :cy="height / 2"
        :r="Math.min(width, height) / 4"
        :fill="color"
        :opacity="opacity"
      />
    </g>
  </svg>
</template><script s
etup lang="ts">
import { computed, type CSSProperties } from "vue";

/** 装饰类型 */
type DecorativeType = "background-pattern" | "divider" | "border" | "geometric" | "logo";

/** 变体类型 */
type VariantType = "simple" | "decorative" | "wave" | "dashed" | "triangle" | "hexagon" | "circle" | "diamond" | "complex";

/** 组件属性接口 */
interface IDecorativeSvgProps {
  /** 装饰类型 */
  type?: DecorativeType;
  /** 变体 */
  variant?: VariantType;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 颜色 */
  color?: string;
  /** 文字颜色（Logo 使用） */
  textColor?: string;
  /** 透明度 */
  opacity?: number;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 边框圆角 */
  borderRadius?: number;
  /** 虚线数组 */
  dashArray?: string;
  /** 是否启用动画 */
  animated?: boolean;
  /** Logo 文字 */
  logoText?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 自定义样式 */
  customStyles?: CSSProperties;
}

// 定义属性
const props = withDefaults(defineProps<IDecorativeSvgProps>(), {
  type: "geometric",
  variant: "circle",
  width: 100,
  height: 100,
  color: "#3B82F6",
  textColor: "#FFFFFF",
  opacity: 1,
  strokeWidth: 2,
  borderRadius: 0,
  dashArray: "5,5",
  animated: false,
  logoText: "LOGO",
  fontSize: 14,
});

/** 计算视图框 */
const viewBox = computed(() => `0 0 ${props.width} ${props.height}`);

/** 计算 SVG 样式 */
const svgStyles = computed((): CSSProperties => {
  return {
    ...props.customStyles,
  };
});

/** 获取六边形点坐标 */
const getHexagonPoints = (): string => {
  const centerX = props.width / 2;
  const centerY = props.height / 2;
  const radius = Math.min(props.width, props.height) / 2 - 10;
  
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  
  return points.join(" ");
};
</script>

<style scoped>
.decorative-svg {
  @apply block;
}

/* 动画效果 */
.decorative-svg--animated {
  @apply transition-all duration-500;
}

/* 背景图案样式 */
.decorative-svg--background-pattern {
  @apply w-full h-full;
}

/* 分割线样式 */
.decorative-svg--divider {
  @apply w-full;
}

/* 边框样式 */
.decorative-svg--border {
  @apply w-full h-full;
}

/* 几何图形样式 */
.decorative-svg--geometric {
  @apply inline-block;
}

/* Logo 样式 */
.decorative-svg--logo {
  @apply inline-block;
}

/* 悬停效果 */
.decorative-svg:hover {
  @apply opacity-80;
}

/* 动画关键帧 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 应用动画 */
.decorative-svg--animated.decorative-svg--geometric {
  animation: float 3s ease-in-out infinite;
}

.decorative-svg--animated.decorative-svg--logo {
  animation: pulse 2s ease-in-out infinite;
}

.decorative-svg--animated.decorative-svg--background-pattern {
  animation: rotate 20s linear infinite;
}
</style>