import Button from "@/ui/Button";

export default function ErrorBox({ title, message, buttonText, onClick }) {
  return (
    <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 text-center shadow-soft">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      {buttonText ? (
        <Button className="mt-5" onClick={onClick}>
          {buttonText}
        </Button>
      ) : null}
    </section>
  );
}
