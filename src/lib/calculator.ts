import { LogisticsCompany, PricingRule, CalculationResult, CalculationInput, ExtraWeightTier } from '@/types';

/**
 * 查找最匹配的定价规则
 * 优先级：完全匹配 > 省份匹配 > 默认规则
 */
function findPricingRule(company: LogisticsCompany, destination: string): PricingRule | null {
  const rules = company.pricing;
  
  // 1. 尝试完全匹配
  let exactMatch = rules.find(rule => 
    rule.destination.toLowerCase() === destination.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // 2. 尝试城市匹配（如 "广东省内/东莞市" 匹配 "东莞市"）
  const cityMatch = rules.find(rule => 
    rule.destination.includes(destination) || destination.includes(rule.destination.split('/').pop() || '')
  );
  
  if (cityMatch) {
    return cityMatch;
  }
  
  // 3. 尝试省份匹配
  const province = destination.includes('省') ? destination.split('省')[0] + '省' : destination;
  const provinceMatch = rules.find(rule => 
    rule.destination.includes(province) && !rule.destination.includes('/')
  );
  
  if (provinceMatch) {
    return provinceMatch;
  }
  
  // 4. 如果没有找到匹配，返回null
  return null;
}

/**
 * 查找适用的续重价格梯度
 */
function findApplicableTier(weight: number, baseWeight: number, tiers: ExtraWeightTier[]): ExtraWeightTier | null {
  const extraWeight = weight - baseWeight;
  
  if (extraWeight <= 0 || tiers.length === 0) {
    return null;
  }
  
  // 按最小重量排序，确保找到正确的梯度
  const sortedTiers = [...tiers].sort((a, b) => a.min_weight - b.min_weight);
  
  for (const tier of sortedTiers) {
    const maxWeight = tier.max_weight === 'inf' || tier.max_weight === Infinity || tier.max_weight === 99999 ? 99999 : Number(tier.max_weight);
    
    if (extraWeight >= tier.min_weight && extraWeight <= maxWeight) {
      return tier;
    }
  }
  
  // 如果没有找到合适的梯度，返回最高梯度
  return sortedTiers[sortedTiers.length - 1] || null;
}

/**
 * 计算单个物流公司的价格
 */
function calculateCompanyPrice(company: LogisticsCompany, input: CalculationInput): CalculationResult | null {
  const rule = findPricingRule(company, input.destination);
  
  if (!rule || rule.base_price === 0) {
    return null; // 该公司不支持此目的地或价格为0（如极兔的省外）
  }
  
  const { weight } = input;
  const { base_weight_kg, base_price, extra_weight_tiers } = rule;
  
  let totalPrice = base_price;
  let extraPrice = 0;
  let appliedTier: ExtraWeightTier | undefined;
  
  // 如果重量超过首重，计算续重费用
  if (weight > base_weight_kg) {
    const extraWeight = weight - base_weight_kg;
    const tier = findApplicableTier(weight, base_weight_kg, extra_weight_tiers);
    
    if (tier) {
      extraPrice = extraWeight * tier.price_per_kg;
      totalPrice += extraPrice;
      appliedTier = tier;
    }
  }
  
  return {
    company: company.company,
    totalPrice: Math.round(totalPrice * 100) / 100, // 保留两位小数
    basePrice: base_price,
    extraPrice: Math.round(extraPrice * 100) / 100,
    breakdown: {
      baseWeight: base_weight_kg,
      basePrice: base_price,
      extraWeight: Math.max(0, weight - base_weight_kg),
      extraPrice: Math.round(extraPrice * 100) / 100,
      appliedTier
    }
  };
}

/**
 * 计算所有物流公司的价格并排序
 */
export function calculateAllPrices(companies: LogisticsCompany[], input: CalculationInput): CalculationResult[] {
  const results: CalculationResult[] = [];
  
  for (const company of companies) {
    const result = calculateCompanyPrice(company, input);
    if (result) {
      results.push(result);
    }
  }
  
  // 按价格从低到高排序
  return results.sort((a, b) => a.totalPrice - b.totalPrice);
}

/**
 * 验证输入数据
 */
export function validateInput(input: CalculationInput): { isValid: boolean; error?: string } {
  if (!input.destination || input.destination.trim() === '') {
    return { isValid: false, error: '请选择目的地' };
  }
  
  if (!input.weight || input.weight <= 0) {
    return { isValid: false, error: '请输入有效的重量（大于0）' };
  }
  
  if (input.weight > 10000) {
    return { isValid: false, error: '重量不能超过10000公斤' };
  }
  
  return { isValid: true };
}
