// Component preview at /components, for checking components by eye. Not linked from the app.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { EmptyState } from "@/components/EmptyState";
import { TextArea } from "@/components/TextArea";
import { IconButton } from "@/components/IconButton";
import { Icon, iconNames } from "@/components/Icon";
import { Logo } from "@/components/Logo";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-grey-tertiary bg-white-main p-4">
      <h2 className="text-subheading-18-bold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-4">{children}</div>;
}

export const metadata: Metadata = { title: "Components · Copymopy" };

const sampleOptions = [
  { value: "error", label: "Error message" },
  { value: "toast", label: "Toast" },
];

export default function ComponentPreview() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <Logo />
        <h1 className="text-heading-32">Component preview</h1>
        <p className="text-subheading-18 text-grey-secondary">
          The building blocks for Copymopy.
        </p>
      </header>

      <Section title="Dropdown">
        <div className="grid gap-4 sm:grid-cols-2">
          <Dropdown label="Element" options={sampleOptions} defaultValue="error" />
          <Dropdown label="Product" options={sampleOptions} placeholder="Select a product" helper="Helper text" />
          <Dropdown label="Element" options={sampleOptions} defaultValue="" placeholder="Select an element" error="Pick an element to continue." />
          <Dropdown label="Element" options={sampleOptions} defaultValue="error" disabled />
        </div>
      </Section>

      <Section title="Text area">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea label="What happened?" placeholder="e.g. The card payment failed at checkout" rows={3} />
          <TextArea label="With helper and counter" helper="Helper text" maxLength={160} rows={3} />
          <TextArea label="What happened?" error="Add a few words so there’s something to work with." rows={3} />
          <TextArea label="Disabled" defaultValue="Can’t edit this" disabled rows={3} />
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState title="Your copy will show up here" action={<Button variant="secondary">Try an example</Button>}>
          Pick an element, describe the situation, then select Write copy.
        </EmptyState>
      </Section>

      <Section title="Logo">
        <Row>
          <Logo size={32} />
          <Logo size={28} />
          <Logo variant="mark" size={32} />
          <Logo variant="mark" size={20} />
        </Row>
        <div className="rounded-md bg-blue-main p-4">
          <Logo inverse />
        </div>
      </Section>

      <Section title="Button">
        <Row>
          <Button variant="primary">Write copy</Button>
          <Button variant="secondary">Try again</Button>
          <Button variant="ghost">Discard</Button>
        </Row>
        <Row>
          <Button size="lg">Save changes</Button>
          <Button size="md">Save changes</Button>
          <Button size="sm">Save changes</Button>
        </Row>
        <Row>
          <Button icon="sparkles">Write copy</Button>
          <Button variant="secondary" icon="refresh">Try again</Button>
          <Button variant="ghost" icon="pencil">Edit</Button>
        </Row>
        <Row>
          <Button loading>Write copy</Button>
          <Button disabled>Write copy</Button>
          <Button variant="secondary" disabled>Try again</Button>
          <Button variant="ghost" disabled>Discard</Button>
        </Row>
      </Section>

      <Section title="Icon button">
        <Row>
          <IconButton icon="copy" label="Copy" />
          <IconButton icon="refresh" label="Try again" />
          <IconButton icon="close" label="Close" />
          <IconButton icon="copy" label="Copy" size="sm" />
          <IconButton icon="close" label="Close" disabled />
        </Row>
      </Section>

      <Section title="Icons">
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {iconNames.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 text-caption-12 text-grey-secondary">
              <Icon name={name} className="text-heading-24 text-grey-main" />
              {name}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
