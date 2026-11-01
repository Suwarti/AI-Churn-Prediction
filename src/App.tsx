/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CustomerProvider, useCustomer } from './context/CustomerContext';
import { Header } from './components/layout/Header';
import { HorizontalNavBar } from './components/layout/HorizontalNavBar';
import { PrerequisiteModal } from './components/common/PrerequisiteModal';
import { ChurnPredictionTab } from './components/tabs/ChurnPredictionTab';
import { CustomerValueTab } from './components/tabs/CustomerValueTab';
import { DecisionFrameworkTab } from './components/tabs/DecisionFrameworkTab';
import { ScenarioViewTab } from './components/tabs/ScenarioViewTab';
import { RoiCalculationTab } from './components/tabs/RoiCalculationTab';
import { GenerateInsightTab } from './components/tabs/GenerateInsightTab';

function MainApp() {
  const { activeTab } = useCustomer();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Full-Width Header */}
      <Header />

      {/* 2. Full-Width Horizontal Navigation Tabs */}
      <HorizontalNavBar />

      {/* 3. Main Content Area (Full available viewport width with responsive max-w-7xl container) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'prediction' && <ChurnPredictionTab />}
        {activeTab === 'customer-value' && <CustomerValueTab />}
        {activeTab === 'decision-framework' && <DecisionFrameworkTab />}
        {activeTab === 'scenario-view' && <ScenarioViewTab />}
        {activeTab === 'roi-calculation' && <RoiCalculationTab />}
        {activeTab === 'generate-insight' && <GenerateInsightTab />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AI Churn Prediction</span>
            <span>&bull;</span>
            <span className="text-slate-400">For Smarter Customer Retention Strategies</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Enterprise Decision Support Platform &bull; Powered by Google Gemini AI
          </div>
        </div>
      </footer>

      {/* Prerequisite Instruction Modal when clicking locked tabs */}
      <PrerequisiteModal />
    </div>
  );
}

export default function App() {
  return (
    <CustomerProvider>
      <MainApp />
    </CustomerProvider>
  );
}
