import { Wordle } from "./components/wordle";
import { AllowedWords } from "@/components/allowed-words.tsx";
import { Suspense } from "react";
import { SuggestedWords } from "@/components/suggested-words.tsx";
import { ErrorBoundary } from "@/components/error-boundary.tsx";

function App() {
  return (
    <>
      <h1 className="scroll-m-20 mt-12 mb-6 text-4xl font-bold tracking-tight lg:text-5xl text-center">
        עוזר וורדעל
      </h1>
      <ErrorBoundary
        fallback={
          <div className="text-destructive text-center my-36">
            אופס, יש כאן באג 😭
          </div>
        }
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-6 gap-2">
          <Wordle className="md:row-span-2 xl:row-span-1" />
          <Suspense
            fallback={<div className="text-center xl:col-span-2">טוען...</div>}
          >
            <SuggestedWords />
            <div className="md:col-start-2 xl:col-start-3">
              <AllowedWords />
            </div>
          </Suspense>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
