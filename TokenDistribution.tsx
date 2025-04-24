
import React from "react";
import { TokenAllocation } from "./TokenAllocation";
import { FinancialProjections } from "./FinancialProjections";
import { CompetitiveMetrics } from "./CompetitiveMetrics";
import { ExploreProcess } from "./ExploreProcess";
import { QuantumAIAnalysis } from "./QuantumAIAnalysis";
import { CryptoTechnologies } from "./CryptoTechnologies";

export function TokenDistribution() {
  return (
    <section className="space-y-8">
      <QuantumAIAnalysis />
      <CryptoTechnologies />
      <TokenAllocation />
      <ExploreProcess />
      <FinancialProjections />
      <CompetitiveMetrics />
    </section>
  );
}
