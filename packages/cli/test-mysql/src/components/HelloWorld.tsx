interface HelloWorldProps {
  greeting?: string;
}

export default function HelloWorld({ greeting = "Hello from Next.js!" }: HelloWorldProps) {
  return (
    <div className="hello-world">
      <h2 className="hello-world-title">{greeting}</h2>
      <p className="hello-world-description">
        This is a simple component example using TypeScript.
      </p>
    </div>
  );
}

<style>{`
  .hello-world {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .hello-world-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .hello-world-description {
    font-size: 1.125rem;
    opacity: 0.9;
  }
`}</style>;
