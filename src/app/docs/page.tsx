"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Search, Book, Zap, FileText, ChevronRight, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DocsPage() {
    const navigation = [
        {
            title: "Getting Started",
            links: [
                { label: "Overview", href: "#overview" },
                { label: "Quick Start", href: "#quick-start" },
                { label: "First Transform", href: "#first-transform" },
                { label: "API Keys", href: "#api-keys" }
            ]
        },
        {
            title: "Core Concepts",
            links: [
                { label: "Schemas & Mapping", href: "#schemas-mapping" },
                { label: "Validation Rules", href: "#validation-rules" },
                { label: "Transform Plans", href: "#transform-plans" },
                { label: "Connectors", href: "#connectors" }
            ]
        },
        {
            title: "API Reference",
            links: [
                { label: "Authentication", href: "#authentication" },
                { label: "Endpoints", href: "#endpoints" },
                { label: "Errors", href: "#errors" },
                { label: "Webhooks", href: "#webhooks" }
            ]
        },
        {
            title: "Guides & SDKs",
            links: [
                { label: "SDKs", href: "#sdks" },
                { label: "Migration", href: "#migration" },
                { label: "Release Notes", href: "#release-notes" },
                { label: "Support", href: "#support" }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Docs Header */}
                <div className="bg-gray-50 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
                        <p className="text-lg text-gray-500 mb-8 max-w-3xl">
                            Everything you need to integrate Morphix into your data pipelines.
                        </p>
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search documentation..."
                                className="pl-10 h-12 bg-white shadow-sm border-gray-300 text-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-8 sticky top-24">
                            {navigation.map(section => (
                                <div key={section.title}>
                                    <h4 className="font-bold text-gray-900 mb-4 px-2">{section.title}</h4>
                                    <ul className="space-y-1">
                                        {section.links.map(link => (
                                            <li key={link.href}>
                                                <a
                                                    href={link.href}
                                                    className="block px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Content - Mockup */}
                    <div className="flex-grow max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <a href="#quick-start" className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                                <Book className="w-8 h-8 text-purple-600 mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">Getting Started</h3>
                                <p className="text-gray-500 text-sm">5 minute setup guide to your first transformation.</p>
                            </a>
                            <a href="#endpoints" className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                                <Zap className="w-8 h-8 text-orange-500 mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">API Reference</h3>
                                <p className="text-gray-500 text-sm">Complete API documentation with examples.</p>
                            </a>
                            <a href="#sdks" className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                                <FileText className="w-8 h-8 text-green-500 mb-4" />
                                <h3 className="font-bold text-gray-900 mb-2">Guides</h3>
                                <p className="text-gray-500 text-sm">Step-by-step tutorials for common use cases.</p>
                            </a>
                        </div>

                        <div className="prose prose-purple max-w-none">
                            <section id="overview" className="scroll-mt-24">
                                <h2>Welcome to Morphix</h2>
                                <p>
                                    Morphix is the AI-powered transformation layer for modern data stacks. Use Morphix to ingest files,
                                    normalize schemas, and deliver clean, validated outputs to your warehouse, CRM, or downstream apps.
                                </p>
                                <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                        <span>App Console: </span>
                                        <a className="text-primary hover:underline" href="https://morphix.app">
                                            https://morphix.app
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                        <span>API Base URL: </span>
                                        <span className="font-mono">https://api.morphix.app/v1</span>
                                    </div>
                                </div>
                            </section>

                            <section id="quick-start" className="scroll-mt-24">
                                <h3>Quick Start</h3>
                                <p>Provision an API key, upload a file, and get a normalized output in minutes.</p>
                                <ol>
                                    <li>Sign in to the Morphix console and create a new workspace.</li>
                                    <li>Generate an API key under <strong>Settings → API Keys</strong>.</li>
                                    <li>Upload a sample file to inspect detected columns and types.</li>
                                </ol>
                            </section>

                            <section id="first-transform" className="scroll-mt-24">
                                <h3>First Transform</h3>
                                <p>Transform your first file using cURL:</p>

                                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <span className="text-purple-400">curl</span> -X POST https://api.morphix.app/v1/transform \<br />
                                    &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                                    &nbsp;&nbsp;-F <span className="text-green-400">"file=@data.xlsx"</span> \<br />
                                    &nbsp;&nbsp;-F <span className="text-green-400">"target_schema=customer_v1"</span>
                                </div>

                                <p>
                                    The response includes a <code>job_id</code> and a <code>download_url</code>. Poll the job endpoint or
                                    register a webhook to receive completion events.
                                </p>
                            </section>

                            <section id="api-keys" className="scroll-mt-24">
                                <h3>API Keys</h3>
                                <p>
                                    API keys are workspace-scoped and support role-based permissions. Rotate keys quarterly and restrict
                                    them to the minimum scopes needed for each integration.
                                </p>
                                <ul>
                                    <li>Production keys are labeled and require 2FA to create.</li>
                                    <li>Use environment variables to inject keys into CI/CD pipelines.</li>
                                    <li>Keys can be revoked instantly without downtime for existing jobs.</li>
                                </ul>
                            </section>

                            <section id="schemas-mapping" className="scroll-mt-24">
                                <h3>Schemas &amp; Mapping</h3>
                                <p>
                                    Define a target schema to normalize fields across source systems. Morphix learns from examples and
                                    suggests mappings that you can approve or override.
                                </p>
                                <ul>
                                    <li>Schema definitions support nested objects, arrays, and custom enum types.</li>
                                    <li>Map multiple input columns into a single output field with templates.</li>
                                    <li>Store mapping profiles per integration to reuse across datasets.</li>
                                </ul>
                            </section>

                            <section id="validation-rules" className="scroll-mt-24">
                                <h3>Validation Rules</h3>
                                <p>
                                    Validation rules ensure output quality. Define required fields, data type constraints, and
                                    cross-field dependencies before export.
                                </p>
                                <ul>
                                    <li>Flag invalid records with structured error reasons.</li>
                                    <li>Apply normalization rules like phone or address formatting.</li>
                                    <li>Route invalid rows to a quarantine dataset for review.</li>
                                </ul>
                            </section>

                            <section id="transform-plans" className="scroll-mt-24">
                                <h3>Transform Plans</h3>
                                <p>
                                    Transform plans bundle schemas, mappings, and validation into reusable workflows. Plans can be
                                    scheduled or triggered via API.
                                </p>
                                <ul>
                                    <li>Create versioned plans to support schema migrations.</li>
                                    <li>Attach enrichment steps like geocoding or deduplication.</li>
                                    <li>Enable incremental processing for large uploads.</li>
                                </ul>
                            </section>

                            <section id="connectors" className="scroll-mt-24">
                                <h3>Connectors</h3>
                                <p>
                                    Connectors sync data to your favorite tools. Use native integrations or webhook exports to deliver
                                    transformed data to destinations.
                                </p>
                                <ul>
                                    <li>Data warehouses: Snowflake, BigQuery, Redshift.</li>
                                    <li>CRMs: Salesforce, HubSpot, and custom APIs.</li>
                                    <li>Storage: S3, Google Cloud Storage, Azure Blob.</li>
                                </ul>
                            </section>

                            <section id="authentication" className="scroll-mt-24">
                                <h3>Authentication</h3>
                                <p>All API requests use bearer authentication. Send the API key in the Authorization header.</p>
                                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <span className="text-purple-400">Authorization</span>: Bearer YOUR_API_KEY
                                </div>
                            </section>

                            <section id="endpoints" className="scroll-mt-24">
                                <h3>Endpoints</h3>
                                <p>Common endpoints for upload, status checks, and exports.</p>
                                <div className="overflow-x-auto">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Endpoint</th>
                                                <th>Method</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><code>/transform</code></td>
                                                <td>POST</td>
                                                <td>Submit a new transformation job.</td>
                                            </tr>
                                            <tr>
                                                <td><code>/jobs/:id</code></td>
                                                <td>GET</td>
                                                <td>Check job status and metadata.</td>
                                            </tr>
                                            <tr>
                                                <td><code>/jobs/:id/output</code></td>
                                                <td>GET</td>
                                                <td>Download the transformed output.</td>
                                            </tr>
                                            <tr>
                                                <td><code>/webhooks</code></td>
                                                <td>POST</td>
                                                <td>Create a webhook subscription.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section id="errors" className="scroll-mt-24">
                                <h3>Errors</h3>
                                <p>
                                    Errors use standard HTTP codes with structured JSON payloads. Capture the <code>request_id</code> for
                                    support.
                                </p>
                                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    {`{
  "error": {
    "code": "invalid_schema",
    "message": "Target schema customer_v1 is missing required field email",
    "request_id": "req_9fd2f"
  }
}`}
                                </div>
                            </section>

                            <section id="webhooks" className="scroll-mt-24">
                                <h3>Webhooks</h3>
                                <p>
                                    Register webhooks to receive job status changes. Webhooks retry on failure and include a signature
                                    for verification.
                                </p>
                                <ul>
                                    <li>Events: <code>job.created</code>, <code>job.completed</code>, <code>job.failed</code>.</li>
                                    <li>Verify signatures with your webhook secret.</li>
                                    <li>Use idempotent handlers to prevent duplicate processing.</li>
                                </ul>
                            </section>

                            <section id="sdks" className="scroll-mt-24">
                                <h3>SDKs</h3>
                                <p>Use SDKs for faster integration and typed responses.</p>
                                <ul>
                                    <li>TypeScript: <code>@morphix/sdk</code></li>
                                    <li>Python: <code>morphix-sdk</code></li>
                                    <li>Go: <code>github.com/morphix/app-sdk</code></li>
                                </ul>
                            </section>

                            <section id="migration" className="scroll-mt-24">
                                <h3>Migration Guide</h3>
                                <p>
                                    Migrating from legacy ETL? Start by documenting your current schema, then map fields to Morphix
                                    targets and validate outputs in a staging workspace.
                                </p>
                                <ul>
                                    <li>Export mapping templates from the Morphix console.</li>
                                    <li>Run side-by-side comparisons on historical data.</li>
                                    <li>Promote the plan to production once validation is clean.</li>
                                </ul>
                            </section>

                            <section id="release-notes" className="scroll-mt-24">
                                <h3>Release Notes</h3>
                                <p>
                                    Track new features, deprecations, and API changes in the release feed inside the Morphix console.
                                    Subscribe to updates for weekly summary emails.
                                </p>
                            </section>

                            <section id="support" className="scroll-mt-24">
                                <h3>Support</h3>
                                <p>
                                    Need help? Reach our support team via the in-app messenger or email
                                    <a className="text-primary hover:underline" href="mailto:support@morphix.app"> support@morphix.app</a>.
                                </p>
                                <ul>
                                    <li>Enterprise SLA: 24/5 coverage with a 1-hour response time.</li>
                                    <li>Community: Join the public roadmap and feature requests.</li>
                                    <li>Status: Monitor incidents at <code>status.morphix.app</code>.</li>
                                </ul>
                            </section>

                            <h3 className="mt-10">Next Steps</h3>
                            <ul className="space-y-2 list-none pl-0">
                                {[
                                    { label: "Define your target schema", href: "#schemas-mapping" },
                                    { label: "Configure transformation rules", href: "#validation-rules" },
                                    { label: "Set up webhooks", href: "#webhooks" }
                                ].map(item => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <ChevronRight className="w-4 h-4" /> {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
