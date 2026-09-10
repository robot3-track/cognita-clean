import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Award, Percent } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GradeChecker() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Homework & Assignments', weight: 20, score: 95 },
    { id: '2', name: 'Quizzes', weight: 30, score: 88 },
    { id: '3', name: 'Midterm Exam', weight: 25, score: 82 },
  ]);

  const [finalWeight, setFinalWeight] = useState(25);
  const [targetGrade, setTargetGrade] = useState(90);

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: 'New Category', weight: 10, score: 100 }
    ]);
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        return { ...c, [field]: field === 'name' ? value : parseFloat(value) || 0 };
      }
      return c;
    }));
  };

  const totalCurrentWeight = categories.reduce((sum, c) => sum + (c.weight || 0), 0);
  
  const currentWeightedAverage = totalCurrentWeight > 0 
    ? categories.reduce((sum, c) => sum + ((c.score || 0) * (c.weight || 0)), 0) / totalCurrentWeight 
    : 0;

  // Final Exam Target Grade Calculation
  // Overall = (CurrentAvg * (100 - FinalWeight)/100) + (NeededFinal * FinalWeight/100) = TargetGrade
  const weightOfExisting = 100 - (parseFloat(finalWeight) || 0);
  const currentContrib = (currentWeightedAverage * weightOfExisting) / 100;
  const neededOnFinal = finalWeight > 0 
    ? ((parseFloat(targetGrade) || 0) - currentContrib) / (finalWeight / 100)
    : 0;

  const getLetterGrade = (numScore) => {
    if (numScore >= 93) return 'A';
    if (numScore >= 90) return 'A-';
    if (numScore >= 87) return 'B+';
    if (numScore >= 83) return 'B';
    if (numScore >= 80) return 'B-';
    if (numScore >= 80) return 'C+';
    if (numScore >= 73) return 'C';
    if (numScore >= 70) return 'C-';
    if (numScore >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-5">
        <div className="p-3 bg-violet-500/10 text-violet-600 rounded-2xl">
          <Calculator className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Checker & Target Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Calculate your current weighted grade and find out what score you need on remaining exams to hit your goal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Grade Categories */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Percent className="w-5 h-5 text-violet-500" />
                Course Categories
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addCategory} className="gap-1 text-xs">
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-colors">
                  <Input 
                    type="text" 
                    value={cat.name} 
                    onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                    className="flex-1 h-9 text-sm font-medium"
                    placeholder="Category Name"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <Input 
                      type="number" 
                      value={cat.weight} 
                      onChange={(e) => updateCategory(cat.id, 'weight', e.target.value)}
                      className="h-9 text-sm text-right pr-1"
                      placeholder="Weight"
                      min="0"
                      max="100"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-1 w-24">
                    <Input 
                      type="number" 
                      value={cat.score} 
                      onChange={(e) => updateCategory(cat.id, 'score', e.target.value)}
                      className="h-9 text-sm text-right pr-1 font-semibold"
                      placeholder="Score"
                      min="0"
                      max="100"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeCategory(cat.id)}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground border-t border-border">
                <span>Total Category Weight: <strong className={totalCurrentWeight === 100 ? "text-emerald-500" : "text-amber-500"}>{totalCurrentWeight}%</strong></span>
                {totalCurrentWeight !== 100 && (
                  <span className="text-amber-500 font-medium">Tip: Total weight should ideally equal 100%</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & Final Exam Goal */}
        <div className="space-y-4">
          {/* Current Average Card */}
          <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border-violet-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Current Grade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {currentWeightedAverage.toFixed(1)}%
                </span>
                <span className="text-xl font-bold text-violet-600 bg-violet-500/10 px-2.5 py-0.5 rounded-lg">
                  {getLetterGrade(currentWeightedAverage)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {categories.length} weighted category inputs.
              </p>
            </CardContent>
          </Card>

          {/* Final Exam Required Score Calculator */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-500" />
                Target Grade Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Target Course Grade (%)
                </label>
                <Input 
                  type="number" 
                  value={targetGrade} 
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="h-9"
                  placeholder="e.g. 90"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Final Exam Weight (%)
                </label>
                <Input 
                  type="number" 
                  value={finalWeight} 
                  onChange={(e) => setFinalWeight(e.target.value)}
                  className="h-9"
                  placeholder="e.g. 25"
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted-foreground block font-medium">Needed on Final Exam:</span>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold ${neededOnFinal > 100 ? 'text-rose-500' : neededOnFinal <= 0 ? 'text-emerald-500' : 'text-violet-600'}`}>
                    {neededOnFinal <= 0 ? '0% (Already Secured!)' : `${neededOnFinal.toFixed(1)}%`}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {neededOnFinal > 100 ? 'Extra credit required' : neededOnFinal > 90 ? 'Challenging' : 'Achievable'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
