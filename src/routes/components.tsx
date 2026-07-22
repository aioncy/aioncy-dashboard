import { Route } from "@tanstack/react-router"
import { Route as rootRoute } from "./__root"
import { useState } from "react"
import Button from "../components/Button"
import Dropdown from "../components/Dropdown"
import TextInput from "../components/TextInput"

export const componentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/components",
  component: ComponentsPage,
})

function ComponentsPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white p-12">
      <h1 className="text-4xl font-bold text-black! mb-12">Component Review</h1>

      {/* Button Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Button</h2>
        <p className="text-gray-600 text-lg mb-10">A versatile button component with multiple variants and sizes.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Large Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Button Large</h3>
            
            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="lg" icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                </svg>
              }>
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="lg">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="lg">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="lg" disabled>Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="text" size="lg">Text Button</Button>
            </div>
          </div>

          {/* Medium Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Button Medium</h3>
            
            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="md" icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                </svg>
              }>
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="md">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="md">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="text" size="md">Text Button</Button>
            </div>
          </div>

          {/* Small Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Button Small</h3>
            
            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="sm" icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                </svg>
              }>
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="sm">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="sm">Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" size="sm" icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                </svg>
              }>
                Button
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="primary" size="sm" disabled>Button</Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="text" size="sm">Text Button</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Dropdown</h2>
        <p className="text-gray-600 text-lg mb-10">A dropdown component with multiple variants and icon support.</p>

        <div className="flex flex-col items-center gap-4">
          <Dropdown 
            isOpen={dropdownOpen}
            onToggle={() => setDropdownOpen(!dropdownOpen)}
            rightIcon={
              dropdownOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 6L8 10L12 6" stroke="#1C1C1C" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2158_1032)">
<path d="M12 10L8 6L4 10" stroke="#1C1C1C" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2158_1032">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

              )
            }
          >
            Button
          </Dropdown>


           <Dropdown 
            isOpen={dropdownOpen}
            onToggle={() => setDropdownOpen(!dropdownOpen)}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            }
            rightIcon={
              dropdownOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 6L8 10L12 6" stroke="#1C1C1C" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 6L8 10L12 6" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2158_1032)">
<path d="M12 10L8 6L4 10" stroke="#1C1C1C" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 10L8 6L4 10" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2158_1032">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

              )
            }
          >
            Button
          </Dropdown>

          <Dropdown 
            variant="withClose"
            rightIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            }
          >
            Active
          </Dropdown>

          <Dropdown 
            variant="withClose"
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            }
            rightIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            }
          >
            Button
          </Dropdown>
        </div>
      </section>

      {/* TextInput Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-black! mb-4">Text Input</h2>
        <p className="text-gray-600 text-lg mb-10">A text input component with multiple states and sizes.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Default State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Default State</h3>
            
            <div className="flex flex-col gap-4">
              <TextInput placeholder="Place Holder" inputSize="md" />
              <TextInput defaultValue="Aryan Sh" inputSize="md" />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Disabled State</h3>
            
            <div className="flex flex-col gap-4">
              <TextInput placeholder="Place Holder" inputSize="md" disabled />
              <TextInput defaultValue="Aryan Sh" inputSize="md" disabled />
            </div>
          </div>

          {/* Read Only State */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Read Only State</h3>
            
            <div className="flex flex-col gap-4">
              <TextInput defaultValue="Sth.aryan@gmail.com" inputSize="md" readOnly />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
