import { LogisticsCompany } from '@/types';

// 动态导入JSON数据
export async function loadPricingData(): Promise<LogisticsCompany[]> {
  try {
    // 导入合并的定价数据文件
    const data = await import('../../data/pricing_data.json');
    return data.default as LogisticsCompany[];
  } catch (error) {
    console.error('Failed to load pricing data:', error);
    return [];
  }
}

// 获取所有可用的目的地列表
export function getAvailableDestinations(companies: LogisticsCompany[]): string[] {
  const destinations = new Set<string>();
  
  companies.forEach(company => {
    company.pricing.forEach(rule => {
      destinations.add(rule.destination);
    });
  });
  
  return Array.from(destinations).sort();
}

// 获取省份列表（从目的地数据中提取）
export function getProvinces(companies: LogisticsCompany[]): string[] {
  const provinces = new Set<string>();
  
  companies.forEach(company => {
    company.pricing.forEach(rule => {
      // 提取省份信息
      const destination = rule.destination;
      if (destination.includes('省')) {
        const province = destination.split('/')[0] || destination.split('省')[0] + '省';
        provinces.add(province);
      } else if (destination.includes('市') && !destination.includes('/')) {
        provinces.add(destination);
      }
    });
  });
  
  return Array.from(provinces).sort();
}
