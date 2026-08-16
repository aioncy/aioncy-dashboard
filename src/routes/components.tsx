import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useState } from "react";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import TextInput from "../components/TextInput";
import PasswordInput from "../components/PasswordInput";
import URLInput from "../components/URLInput";
import Textarea, { CopyTextarea } from "../components/Textarea";
import FilterChip from "../components/FilterChip";
import {
  DropdownList,
  type DropdownListItemProps,
} from "../components/DropdownList";
import FileDropzone from "../components/FileDropzone";
import FileUploadCard from "../components/FileUploadCard";
import Breadcrumb from "../components/Breadcrumb";
import AlertBar from "../components/AlertBar";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";
import PriorityBadge from "../components/PriorityBadge";
import PermissionMenu, {
  type PermissionMenuItem,
} from "../components/PermissionMenu";
import Sidebar from "../components/Sidebar";
import type { Organization } from "../components/WorkspaceSwitcher";
import Logo from "../components/Logo";
import PageHeader from "../components/PageHeader";

export const componentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/components",
  component: ComponentsPage,
});

const avatar = (bg: string, letter: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="${bg}"/><text x="12" y="16.5" font-family="Arial, sans-serif" font-size="12" fill="#fff" text-anchor="middle">${letter}</text></svg>`,
  )}`;

const SidebarDemo = ({ organizations }: { organizations: Organization[] }) => {
  const [activeOrgId, setActiveOrgId] = useState(organizations[0].id);

  return (
    <Sidebar
      organizations={organizations}
      activeOrgId={activeOrgId}
      onSelectOrganization={setActiveOrgId}
    />
  );
};

const variant1: DropdownListItemProps[] = [
  { label: "Text" },
  { label: "Text", selected: true, trailing: "check" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text", destructive: true },
];

const variant2: DropdownListItemProps[] = [
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text", selected: true, trailing: "check" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
];

const variant3: DropdownListItemProps[] = [
  { label: "Text" },
  { label: "Text", selected: true, trailing: "check" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
  { label: "Text" },
];

const variant4: DropdownListItemProps[] = [
  { label: "Text", leading: "dot" },
  { label: "Text", leading: "dot", selected: true, trailing: "check" },
  { label: "Text", leading: "dot" },
  { label: "Text", leading: "dot" },
];

const variant5: DropdownListItemProps[] = [
  { label: "Text", leading: "avatar", avatarSrc: avatar("#A153FF", "A") },
  {
    label: "Text",
    leading: "avatar",
    avatarSrc: avatar("#71717A", "S"),
    selected: true,
    trailing: "check",
  },
  { label: "Text", leading: "avatar", avatarSrc: avatar("#D43A20", "R") },
  { label: "Text", leading: "avatar", avatarSrc: avatar("#3B82F6", "K") },
  { label: "Text", leading: "avatar" },
];

const variant6: DropdownListItemProps[] = [
  { label: "Text", trailing: "text", trailingText: "Text" },
  { label: "Text", trailing: "text", trailingText: "Text" },
  { label: "Text", trailing: "text", trailingText: "Text" },
  { label: "Text", trailing: "text", trailingText: "Text" },
];

const variant7: DropdownListItemProps[] = [
  { label: "Text", leading: "dashedIcon" },
  { label: "Text", leading: "dashedIcon", selected: true },
  { label: "Text", leading: "dashedIcon", trailing: "chevron" },
  { label: "Text", leading: "dashedIcon" },
];

const variant8: DropdownListItemProps[] = [
  {
    label: "Text",
    leading: "avatar",
    avatarSrc: avatar("#A153FF", "A"),
    trailing: "checkbox",
  },
  {
    label: "Text",
    leading: "avatar",
    avatarSrc: avatar("#71717A", "S"),
    trailing: "checkbox",
  },
  {
    label: "Text",
    leading: "avatar",
    avatarSrc: avatar("#D43A20", "R"),
    trailing: "checkbox",
  },
  {
    label: "Text",
    leading: "avatar",
    avatarSrc: avatar("#3B82F6", "K"),
    trailing: "checkbox",
  },
  { label: "Text", leading: "avatar", trailing: "checkbox" },
];

function ComponentsPage() {
  const [url, setUrl] = useState("");
  const [urlFilled, setUrlFilled] = useState("www.prakash");
  const [textarea, setTextarea] = useState("");
  const [textareaFilled, setTextareaFilled] = useState(
    "Paste your content here...",
  );
  const [chips, setChips] = useState(["Type", "Status", "Priority"]);

  return (
    <div className="min-h-screen bg-white p-12">
      <h1 className="text-4xl font-bold text-black! mb-12">Component Review</h1>

      {/* Button Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Button</h2>
        <p className="text-gray-600 text-lg mb-10">
          A versatile button component with multiple variants and sizes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Large Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Button Large
            </h3>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                  </svg>
                }
              >
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="lg">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="lg">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="lg" disabled>
                Button
              </Button>
            </div>
          </div>

          {/* Medium Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Button Medium
            </h3>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="primary"
                size="md"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                  </svg>
                }
              >
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="md">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="md">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="text">Text Button</Button>
            </div>
          </div>

          {/* Small Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Button Small
            </h3>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="primary"
                size="sm"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                  </svg>
                }
              >
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="sm">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="sm">
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                  </svg>
                }
              >
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="sm" disabled>
                Button
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Dropdown</h2>
        <p className="text-gray-600 text-lg mb-10">
          A dropdown component with multiple variants and icon support.
        </p>

        <div className="flex flex-col items-center gap-4">
          <DropdownButton label="Button" trailingIcon="chevron" />

          <DropdownButton label="Button" trailingIcon="chevron" expanded />

          <DropdownButton
            label="Button"
            trailingIcon="chevron"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            }
          />

          <DropdownButton
            label="Button"
            trailingIcon="chevron"
            expanded
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            }
          />

          <DropdownButton label="Active" trailingIcon="close" />

          <DropdownButton
            label="Button"
            trailingIcon="close"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            }
          />
        </div>
      </section>

      {/* TextInput Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Text Input</h2>
        <p className="text-gray-600 text-lg mb-10">
          A text input component with multiple states and feedback.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Default State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Default State
            </h3>

            <div className="flex flex-col gap-4">
              <TextInput placeholder="Placeholder" />
              <TextInput label="Full name" defaultValue="Prakash Sh" />
              <TextInput
                placeholder="With helper text"
                helperText="Helper text goes here"
              />
            </div>
          </div>

          {/* Error State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Error State
            </h3>

            <div className="flex flex-col gap-4">
              <TextInput
                label="Email"
                defaultValue="Prakash"
                errorMessage="Invalid email address"
              />
              <TextInput
                label="Password"
                placeholder="••••••••"
                errorMessage="Password must be at least 8 characters"
              />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Disabled State
            </h3>

            <div className="flex flex-col gap-4">
              <TextInput placeholder="Placeholder" disabled />
              <TextInput label="Full name" defaultValue="Prakash Sh" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* PasswordInput Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          Password Input
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          A password input with show/hide toggle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Default State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Default State
            </h3>

            <div className="flex flex-col gap-4">
              <PasswordInput />
              <PasswordInput label="Password" defaultValue="secret" />
            </div>
          </div>

          {/* Error State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Error State
            </h3>

            <div className="flex flex-col gap-4">
              <PasswordInput
                label="Password"
                defaultValue="secret"
                errorMessage="Password is too short"
              />
              <PasswordInput
                label="Confirm password"
                placeholder="Re-enter password"
                errorMessage="Passwords do not match"
              />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Disabled State
            </h3>

            <div className="flex flex-col gap-4">
              <PasswordInput label="Password" defaultValue="secret" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* URLInput Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">URL Input</h2>
        <p className="text-gray-600 text-lg mb-10">
          A URL input with a static prefix and suffix flanking the editable
          field.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Default State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Default State
            </h3>

            <div className="flex flex-col gap-4">
              <URLInput value={url} onChange={(e) => setUrl(e.target.value)} />
              <URLInput
                label="Website"
                value={urlFilled}
                onChange={(e) => setUrlFilled(e.target.value)}
              />
            </div>
          </div>

          {/* Error State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Error State
            </h3>

            <div className="flex flex-col gap-4">
              <URLInput
                label="Website"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                errorMessage="Enter a valid URL"
              />
              <URLInput
                label="Website"
                value={urlFilled}
                onChange={(e) => setUrlFilled(e.target.value)}
                errorMessage="Enter a valid URL"
              />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Disabled State
            </h3>

            <div className="flex flex-col gap-4">
              <URLInput label="Website" value="www.prakash" disabled />
              <URLInput label="Website" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* Textarea Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Textarea</h2>
        <p className="text-gray-600 text-lg mb-10">
          A multiline text area and a read-only copy-to-clipboard variant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Default State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Default State
            </h3>

            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Type your message here..."
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
              />
              <Textarea
                label="Description"
                value={textareaFilled}
                onChange={(e) => setTextareaFilled(e.target.value)}
              />
            </div>
          </div>

          {/* Copy Variant */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Copy Variant
            </h3>

            <div className="flex flex-col gap-4">
              <CopyTextarea value="Copy element here" />
              <CopyTextarea value="https://www.prakash.com/embed" />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Disabled State
            </h3>

            <div className="flex flex-col gap-4">
              <Textarea placeholder="Type your message here..." disabled />
              <Textarea label="Description" value="Prakash Sh" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* FilterChip Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Filter Chip</h2>
        <p className="text-gray-600 text-lg mb-10">
          Active filter chips with a hover tooltip and remove button.
        </p>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-gray-700">Text Label</h3>
            <div className="flex flex-wrap gap-6 pt-10">
              {chips.map((chip, index) => (
                <FilterChip
                  key={chip}
                  prefix="Filter:"
                  label={chip}
                  onRemove={() => setChips(chips.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-gray-700">Icon + Label</h3>
            <div className="flex flex-wrap gap-6 pt-10">
              <FilterChip
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="#71717A"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  </svg>
                }
                label="Type"
                onRemove={() => {}}
              />
              <FilterChip
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="#71717A"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  </svg>
                }
                label="Assignee"
                onRemove={() => {}}
              />
            </div>
          </div>
        </div>
      </section>
      {/* DropdownList Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          Dropdown List
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          A dropdown menu with 8 variants.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 1</h3>
            <DropdownList items={variant1} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 2</h3>
            <DropdownList items={variant2} maxHeight={210} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 3</h3>
            <DropdownList items={variant3} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 4</h3>
            <DropdownList items={variant4} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 5</h3>
            <DropdownList items={variant5} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 6</h3>
            <DropdownList items={variant6} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 7</h3>
            <DropdownList items={variant7} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-gray-700">Variant 8</h3>
            <DropdownList items={variant8} />
          </div>
        </div>
      </section>

      {/* FileDropzone Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          File Dropzone
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          A drag-and-drop file upload area.
        </p>

        <div className="flex flex-col gap-8">
          <FileDropzone
            accept="application/pdf"
            maxSizeMB={50}
            onFileSelect={() => {}}
          />
        </div>
      </section>

      {/* FileUploadCard Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          File Upload Card
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          A single file row with default, uploading, and error states.
        </p>

        <div className="flex flex-col gap-6">
          <FileUploadCard
            fileName="about_us_doc.pdf"
            fileSize="12 KB"
            status="default"
            onRemove={() => {}}
          />
          <FileUploadCard
            fileName="presentation_deck.pdf"
            fileSize="2.4 MB"
            status="uploading"
            progress={64}
            onRemove={() => {}}
          />
          <FileUploadCard
            fileName="invoice_2026.pdf"
            fileSize="8 MB"
            status="error"
            onRemove={() => {}}
            onRetry={() => {}}
          />
        </div>
      </section>

      {/* Breadcrumb Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Breadcrumb</h2>
        <p className="text-gray-600 text-lg mb-10">
          A navigation trail with a chevron separator and active page.
        </p>

        <div className="flex flex-col gap-8">
          <Breadcrumb
            items={[{ label: "Page", href: "#" }, { label: "Active page" }]}
          />
          <Breadcrumb
            items={[
              { label: "Page", href: "#" },
              { label: "Page", href: "#" },
              { label: "Active page" },
            ]}
          />
        </div>
      </section>

      {/* AlertBar Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">AlertBar</h2>
        <p className="text-gray-600 text-lg mb-10">
          Full-width inline notification bar with an icon, message (supports
          inline bold), optional action link and dismiss button.
        </p>

        <div className="flex flex-col gap-8">
          <AlertBar
            message="You have 4 days left in your Essential plan."
            actionLabel="Upgrade"
            onAction={() => {}}
            dismissible
            onDismiss={() => {}}
          />
          <AlertBar
            message={
              <>
                You have <strong>4 days</strong> left in your Essential plan.
              </>
            }
            actionLabel="Upgrade"
            onAction={() => {}}
          />
          <AlertBar message="Your workspace settings have been updated." />
        </div>
      </section>

      {/* SearchInput Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">SearchInput</h2>
        <p className="text-gray-600 text-lg mb-10">
          Input with a leading search icon and an optional trailing results
          count.
        </p>

        <div className="flex flex-col gap-8">
          <SearchInput />
          <SearchInput placeholder="Search..." />
          <SearchInput resultsCount={1} />
          <SearchInput placeholder="Search..." resultsCount={12} />
        </div>
      </section>

      {/* Pagination Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Pagination</h2>
        <p className="text-gray-600 text-lg mb-10">
          Previous/Next text buttons with numbered pages and ellipsis
          truncation.
        </p>

        <div className="flex flex-col gap-12">
          <PaginationDemo />
          <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
          <Pagination
            currentPage={10}
            totalPages={10}
            onPageChange={() => {}}
          />
          <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
        </div>
      </section>

      {/* PriorityBadge Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          PriorityBadge
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          Small color-coded pill showing a priority level, each with its own
          color pairing.
        </p>

        <div className="flex items-center gap-8">
          <PriorityBadge level="low" />
          <PriorityBadge level="medium" />
          <PriorityBadge level="high" />
          <PriorityBadge level="urgent" label="Urgent" />
        </div>
      </section>

      {/* PermissionMenu Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">
          PermissionMenu
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          Dropdown menu with title + subtitle rows, a selected state, a divider,
          and a destructive action.
        </p>

        <PermissionMenuDemo />
      </section>

      {/* Sidebar Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Sidebar</h2>
        <p className="text-gray-600 text-lg mb-10">
          Navigation sidebar with a logo header, main/secondary nav lists,
          flexible spacer, and a pinned workspace switcher.
        </p>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Logo (reusable)
            </h3>
            <Logo />
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                Sidebar
              </h3>
              <div
                className="rounded-lg border border-gray-200 overflow-hidden"
                style={{ height: 600 }}
              >
                <SidebarDemo
                  organizations={[
                    { id: "acme", name: "Acme", planTier: "Essential" },
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                Sidebar (org switcher)
              </h3>
              <div
                className="rounded-lg border border-gray-200 overflow-hidden"
                style={{ height: 900 }}
              >
                <SidebarDemo
                  organizations={[
                    {
                      id: "nimbus",
                      name: "Nimbus",
                      planTier: "Pro",
                      logoSrc: avatar("#2563EB", "N"),
                    },
                    {
                      id: "acme-corp",
                      name: "Acme Corp",
                      planTier: "Essential",
                      logoSrc: avatar("#2563EB", "A"),
                    },
                    {
                      id: "evil-corp",
                      name: "Evil Corp",
                      planTier: "Essential",
                      logoSrc: avatar("#3f3f46", "E"),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PageHeader Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">PageHeader</h2>
        <p className="text-gray-600 text-lg mb-10">
          Page header with either a plain title or a breadcrumb trail on the
          left, and a collaborator avatar stack plus a Share button on the
          right.
        </p>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Variant A - Plain title
            </h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <PageHeader
                title="Leads"
                collaborators={[
                  {
                    name: "Prakash Shrestha",
                    avatarSrc: avatar("#3B82F6", "A"),
                  },
                  { name: "Sam Doe", avatarSrc: avatar("#D43A20", "S") },
                  { name: "Kiran Rai" },
                ]}
                onShare={() => {}}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Variant B - Breadcrumb
            </h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <PageHeader
                breadcrumbItems={[
                  { label: "Leads", href: "#" },
                  { label: "Prakash Shrestha" },
                ]}
                collaborators={[
                  { name: "Sam Doe", avatarSrc: avatar("#D43A20", "S") },
                  { name: "Kiran Rai" },
                ]}
                onShare={() => {}}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Variant C - All fallback avatars
            </h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <PageHeader
                title="Analytics"
                collaborators={[
                  { name: "Prakash Shrestha" },
                  { name: "Sam Doe" },
                  { name: "Kiran Rai" },
                ]}
                onShare={() => {}}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const PermissionMenuDemo = () => {
  const [selected, setSelected] = useState<string>("Can edit");
  const [removed, setRemoved] = useState<string[]>([]);

  const items: PermissionMenuItem[] = [
    {
      title: "Full access",
      subtitle: "Edit, share, chat",
      selected: selected === "Full access",
      onClick: () => setSelected("Full access"),
    },
    {
      title: "Can edit",
      subtitle: "Edit, chat and tickets",
      selected: selected === "Can edit",
      onClick: () => setSelected("Can edit"),
    },
    {
      title: "Can edit chat",
      subtitle: "Can edit chat only",
      selected: selected === "Can edit chat",
      onClick: () => setSelected("Can edit chat"),
    },
    {
      title: "Can view",
      selected: selected === "Can view",
      onClick: () => setSelected("Can view"),
    },
    {
      title: "Remove",
      destructive: true,
      dividerBefore: true,
      onClick: () =>
        setRemoved((prev) => [...prev, `removed at ${Date.now()}`]),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PermissionMenu items={items} />
      <p className="text-sm text-gray-600">
        {removed.length > 0
          ? `Last action: ${removed[removed.length - 1]}`
          : "No destructive action fired yet"}
      </p>
    </div>
  );
};

const PaginationDemo = () => {
  const [page, setPage] = useState(4);
  return (
    <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  );
};
