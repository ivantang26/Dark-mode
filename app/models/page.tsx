import type { Metadata } from "next";
import ModelCatalogue from "@/components/ModelCatalogue";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Models",
  description: "Every Synapse model with context length, price, speed and internal evals. Filter by modality, context and price.",
};

export default function ModelsPage() {
  return (
    <>
      <PageHero
        eyebrow="model catalogue"
        title="Eight models. One endpoint."
        intro="Swap the model string and nothing else changes. Filter by what you need, then sort by price or speed."
      />
      <section className="container-x py-12 md:py-16">
        <ModelCatalogue />
      </section>
    </>
  );
}
