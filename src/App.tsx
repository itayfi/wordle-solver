function App() {
  return (
    <>
      <h1 className="scroll-m-20 mt-12 mb-6 text-4xl font-medium tracking-tight lg:text-5xl text-center">
        עוזר ווארדעל
      </h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div>1</div>
        <div>2</div>
        <div className="md:col-start-2 xl:col-start-3">3</div>
      </div>
    </>
  );
}

export default App;
