'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorForm } from '@/components/calculator-form';
import { ResultsDisplay } from '@/components/results-display';
import { loadPricingData, getAvailableDestinations } from '@/lib/data-loader';
import { calculateAllPrices, validateInput } from '@/lib/calculator';
import { LogisticsCompany, CalculationInput, CalculationResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [companies, setCompanies] = useState<LogisticsCompany[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculationInput, setCalculationInput] = useState<CalculationInput | null>(null);

  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setIsDataLoading(true);
        const data = await loadPricingData();
        setCompanies(data);
        
        if (data.length > 0) {
          const availableDestinations = getAvailableDestinations(data);
          setDestinations(availableDestinations);
        }
      } catch (err) {
        setError('数据加载失败，请刷新页面重试');
        console.error('Failed to load data:', err);
      } finally {
        setIsDataLoading(false);
      }
    }

    loadData();
  }, []);

  // 处理价格计算
  const handleCalculate = async (input: CalculationInput) => {
    setError('');
    setIsLoading(true);
    
    try {
      // 验证输入
      const validation = validateInput(input);
      if (!validation.isValid) {
        setError(validation.error || '输入数据无效');
        return;
      }

      // 计算价格
      const calculationResults = calculateAllPrices(companies, input);
      
      if (calculationResults.length === 0) {
        setError('抱歉，没有找到适用于该目的地的物流方案');
      } else {
        setResults(calculationResults);
        setCalculationInput(input);
      }
    } catch (err) {
      setError('计算过程中出现错误，请重试');
      console.error('Calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 数据加载中的状态
  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">正在加载物流数据...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 数据加载失败的状态
  if (companies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive mb-4" />
            <p className="text-muted-foreground text-center">
              数据加载失败，请检查网络连接并刷新页面
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 计算器表单 */}
      <CalculatorForm
        destinations={destinations}
        onCalculate={handleCalculate}
        isLoading={isLoading}
      />

      {/* 错误提示 */}
      {error && (
        <Card className="w-full max-w-2xl mx-auto border-destructive">
          <CardContent className="flex items-center py-4">
            <AlertCircle className="h-5 w-5 text-destructive mr-3 flex-shrink-0" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 计算结果 */}
      {results.length > 0 && calculationInput && (
        <ResultsDisplay
          results={results}
          destination={calculationInput.destination}
          weight={calculationInput.weight}
        />
      )}

      {/* 功能介绍 */}
      {results.length === 0 && !error && (
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🚚</div>
                  <h3 className="font-semibold">多家物流</h3>
                  <p className="text-sm text-muted-foreground">
                    支持安能、顺心、韵达、极兔等主流物流公司
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl">⚡</div>
                  <h3 className="font-semibold">快速计算</h3>
                  <p className="text-sm text-muted-foreground">
                    输入目的地和重量，一键获取所有报价
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl">💰</div>
                  <h3 className="font-semibold">价格对比</h3>
                  <p className="text-sm text-muted-foreground">
                    自动排序，轻松找到最优惠的物流方案
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
