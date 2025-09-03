'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalculationResult } from '@/types';
import { Trophy, Eye, EyeOff, Truck, Package2, Calculator } from 'lucide-react';

interface ResultsDisplayProps {
  results: CalculationResult[];
  destination: string;
  weight: number;
}

export function ResultsDisplay({ results, destination, weight }: ResultsDisplayProps) {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <Package2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            暂无可用的物流方案，请尝试其他目的地
          </p>
        </CardContent>
      </Card>
    );
  }

  const lowestPrice = results[0]?.totalPrice || 0;

  const toggleDetails = (company: string) => {
    setShowDetails(showDetails === company ? null : company);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 计算信息摘要 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            计算结果
          </CardTitle>
          <CardDescription>
            目的地：{destination} | 重量：{weight}kg | 找到 {results.length} 个物流方案
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 结果列表 */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <Card key={result.company} className={`transition-all duration-200 ${index === 0 ? 'ring-2 ring-primary/20 shadow-lg' : 'hover:shadow-md'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{result.company}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <span>总价：¥{result.totalPrice}</span>
                      {index === 0 && (
                        <Badge variant="default" className="flex items-center">
                          <Trophy className="h-3 w-3 mr-1" />
                          最低价
                        </Badge>
                      )}
                      {index > 0 && (
                        <Badge variant="outline">
                          比最低价高 ¥{(result.totalPrice - lowestPrice).toFixed(2)}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ¥{result.totalPrice}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDetails(result.company)}
                    className="mt-1"
                  >
                    {showDetails === result.company ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        隐藏明细
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        查看明细
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* 价格明细 */}
            {showDetails === result.company && (
              <CardContent className="pt-0">
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-sm">计费明细</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">首重:</span>
                      <span className="ml-2 font-medium">
                        {result.breakdown.baseWeight}kg × ¥{result.breakdown.basePrice} = ¥{result.breakdown.basePrice}
                      </span>
                    </div>
                    
                    {result.breakdown.extraWeight > 0 && (
                      <div>
                        <span className="text-muted-foreground">续重:</span>
                        <span className="ml-2 font-medium">
                          {result.breakdown.extraWeight}kg × ¥{result.breakdown.appliedTier?.price_per_kg || 0} = ¥{result.breakdown.extraPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  {result.breakdown.appliedTier && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      适用价格区间: {result.breakdown.appliedTier.min_weight}kg - {
                        result.breakdown.appliedTier.max_weight === Infinity || result.breakdown.appliedTier.max_weight === 'inf' || result.breakdown.appliedTier.max_weight === 99999
                          ? '无限制' 
                          : `${result.breakdown.appliedTier.max_weight}kg`
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* 免责声明 */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ 以上价格仅供参考，实际价格请以物流公司报价为准。价格可能因时段、货物类型、合作协议等因素而有所差异。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
