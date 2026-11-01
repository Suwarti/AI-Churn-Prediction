/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerProvider, useCustomer } from './context/CustomerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ModelStatusModal } from './components/common/ModelStatusModal';
import { ChurnPredictionTab } from './components/tabs/ChurnPredictionTab';
import { CustomerValueTab } from './components/tabs/CustomerValueTab';
import { DecisionFrameworkTab } from './components/tabs/DecisionFrameworkTab';
import { ScenarioViewTab } from './components/tabs/ScenarioViewTab';
import { RoiCalculationTab } from './components/tabs/RoiCalculationTab';
import { GenerateInsightTab } from './components/tabs/GenerateInsightTab';

function MainApp() {
  const { activeTab } = useCustomer();
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-row overflow-x-hidden">
      {/* Permanent Left-Side Vertical Sidebar */}
      <Sidebar onOpenModelModal={() => setIsModelModalOpen(true)} />

      {/* Main Content Area on the RIGHT side of the sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header Bar */}
        <Header onOpenModelModal={() => setIsModelModalOpen(true)} />

        {/* Tab Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'prediction' && (
            <ChurnPredictionTab onOpenModelModal={() => setIsModelModalOpen(true)} />
          )}
          {activeTab === 'customer-value' && <CustomerValueTab />}
          {activeTab === 'decision-framework' && <DecisionFrameworkTab />}
          {activeTab === 'scenario-view' && (
            <ScenarioViewTab onOpenModelModal={() => setIsModelModalOpen(true)} />
          )}
          {activeTab === 'roi-calculation' && <RoiCalculationTab />}
          {activeTab === 'generate-insight' && <GenerateInsightTab />}
        </main>
      </div>

      {/* Model Status & API Configuration Modal */}
      <ModelStatusModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
      />
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
