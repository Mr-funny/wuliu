'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Package, MapPin } from 'lucide-react';
import { CalculationInput } from '@/types';

interface CalculatorFormProps {
  destinations: string[];
  onCalculate: (input: CalculationInput) => void;
  isLoading: boolean;
}

export function CalculatorForm({ destinations, onCalculate, isLoading }: CalculatorFormProps) {
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证输入
    if (!destination) {
      setError('请选择目的地');
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weight || weightNum <= 0) {
      setError('请输入有效的重量（大于0）');
      return;
    }

    if (weightNum > 10000) {
      setError('重量不能超过10000公斤');
      return;
    }

    // 调用计算函数
    onCalculate({
      destination,
      weight: weightNum
    });
  };

  // 常用城市列表（从destinations中筛选）
  const popularCities = [
    '广东省内/东莞市',
    '广东省内/深圳市', 
    '广东省内/广州市',
    '浙江省',
    '江苏省',
    '北京市',
    '上海市'
  ].filter(city => destinations.includes(city));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Calculator className="h-8 w-8 text-primary mr-2" />
          <CardTitle className="text-2xl">物流价格计算器</CardTitle>
        </div>
        <CardDescription>
          快速比较不同物流公司的配送费用
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 目的地选择 */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              目的地
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="请选择目的地" />
              </SelectTrigger>
              <SelectContent>
                {/* 常用城市 */}
                {popularCities.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                      常用城市
                    </div>
                    {popularCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                    <div className="border-t my-1" />
                  </>
                )}
                
                {/* 所有目的地 */}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  所有目的地
                </div>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 重量输入 */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              重量 (公斤)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0.1"
              max="10000"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="请输入包裹重量"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* 计算按钮 */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? '计算中...' : '计算价格'}
          </Button>
        </form>

        {/* 使用说明 */}
        <div className="mt-6 text-xs text-muted-foreground space-y-1">
          <p>• 支持安能、顺心、韵达、极兔等物流公司</p>
          <p>• 价格仅供参考，实际价格以物流公司为准</p>
          <p>• 重量范围：0.1kg - 10000kg</p>
        </div>
      </CardContent>
    </Card>
  );
}
