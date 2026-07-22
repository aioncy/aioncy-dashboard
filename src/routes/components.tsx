import { Route } from "@tanstack/react-router"
import { Route as rootRoute } from "./__root"
import Button from "../components/Button"

export const componentsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/components",
  component: ComponentsPage,
})

function ComponentsPage() {
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
          </div>
        </div>
      </section>
    </div>
  )
}
