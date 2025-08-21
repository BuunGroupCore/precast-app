import Counter from "@/components/Counter";
import HelloWorld from "@/components/HelloWorld";

export default function Home() {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Welcome to test-mysql</h1>

        <div className="components">
          <HelloWorld />
          <Counter />
        </div>

        <div className="links">
          <p>
            Get started by editing <code className="code">src/app/page.tsx</code>
          </p>
        </div>
      </main>
    </div>
  );
}
