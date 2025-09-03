// 物流公司数据类型定义
export interface ExtraWeightTier {
  min_weight: number;
  max_weight: number | string; // 可能是 "inf" 表示无限大
  price_per_kg: number;
}

export interface PricingRule {
  destination: string;
  base_weight_kg: number;
  base_price: number;
  extra_weight_tiers: ExtraWeightTier[];
}

export interface LogisticsCompany {
  company: string;
  pricing: PricingRule[];
}

// 计算结果类型定义
export interface CalculationResult {
  company: string;
  totalPrice: number;
  basePrice: number;
  extraPrice: number;
  breakdown: {
    baseWeight: number;
    basePrice: number;
    extraWeight: number;
    extraPrice: number;
    appliedTier?: ExtraWeightTier;
  };
}

// 用户输入类型定义
export interface CalculationInput {
  destination: string;
  weight: number;
}

// 省份和城市数据类型
export interface ProvinceCity {
  province: string;
  cities: string[];
}
