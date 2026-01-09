"use client";

import { useState } from "react";
import { Button } from "../components/ui/button/button";
import { Card, CardBody, CardFooter, CardHeader } from "../components/ui/card/card";
import { Heading } from "../components/ui/heading/heading";
import { Link } from "../components/ui/link/link";
import { Select, SelectItem } from "../components/ui/select/select";
import { type ColumnDef, Table } from "../components/ui/table/table";
import { Text } from "../components/ui/text/text";
import { TextArea } from "../components/ui/text-area/text-area";
import { TextField } from "../components/ui/text-field/text-field";

interface ExampleUser extends Record<string, unknown> {
	id: number;
	name: string;
	email: string;
	role: string;
	status: "Active" | "Inactive";
}

export default function DesignSystemPage() {
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [selectedUser, setSelectedUser] = useState<ExampleUser | null>(null);

	const exampleUsers: ExampleUser[] = [
		{ id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
		{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
		{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "Inactive" },
		{ id: 4, name: "Alice Williams", email: "alice@example.com", role: "Editor", status: "Active" },
		{
			id: 5,
			name: "Charlie Brown",
			email: "charlie@example.com",
			role: "Viewer",
			status: "Active",
		},
	];

	const userColumns: ColumnDef<ExampleUser>[] = [
		{
			header: "Name",
			accessorKey: "name",
		},
		{
			header: "Email",
			accessorKey: "email",
		},
		{
			header: "Role",
			accessorKey: "role",
			render: (value) => (
				<span className="rounded-full bg-primary-600/20 px-2 py-1 text-xs font-medium text-primary-400">
					{String(value)}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			render: (value) => (
				<span
					className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
						value === "Active"
							? "bg-success-600/20 text-success-400"
							: "bg-error-500/20 text-error-400"
					}`}
				>
					{String(value)}
				</span>
			),
		},
	];

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className="min-h-screen bg-background p-8">
				<div className="mx-auto max-w-5xl space-y-12">
					<header className="flex items-start justify-between gap-4">
						<div className="space-y-4">
							<Heading level="h1">Design System</Heading>
							<Text variant="body" size="lg">
								A comprehensive design system built with react-aria-components and Tailwind CSS.
							</Text>
						</div>
						<Button variant="secondary" size="sm" onPress={() => setIsDarkMode(!isDarkMode)}>
							{isDarkMode ? "Light Mode" : "Dark Mode"}
						</Button>
					</header>

					{/* Typography Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Typography
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-4">
								<div className="space-y-2">
									<Text variant="overline" className="">
										Headings
									</Text>
									<Heading level="h1" className="">
										Heading 1
									</Heading>
									<Heading level="h2" className="">
										Heading 2
									</Heading>
									<Heading level="h3" className="">
										Heading 3
									</Heading>
									<Heading level="h4" className="">
										Heading 4
									</Heading>
									<Heading level="h5" className="">
										Heading 5
									</Heading>
									<Heading level="h6" className="">
										Heading 6
									</Heading>
								</div>

								<div className="space-y-2">
									<Text variant="overline" className="">
										Text Variants
									</Text>
									<Text variant="body" className="">
										Body text - The quick brown fox jumps over the lazy dog.
									</Text>
									<Text variant="label" className="">
										Label text - Form field label
									</Text>
									<Text variant="caption" className="">
										Caption text - Additional context or help text
									</Text>
									<Text variant="overline" className="">
										Overline text - Section header
									</Text>
								</div>
							</CardBody>
						</Card>
					</section>

					{/* Buttons Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Buttons
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-6">
								<div className="space-y-3">
									<Text variant="overline" className="">
										Variants
									</Text>
									<div className="flex flex-wrap gap-3">
										<Button variant="primary">Primary Button</Button>
										<Button variant="secondary">Secondary Button</Button>
										<Button variant="ghost">Ghost Button</Button>
										<Button variant="danger">Danger Button</Button>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Sizes
									</Text>
									<div className="flex flex-wrap items-center gap-3">
										<Button size="sm">Small</Button>
										<Button size="md">Medium</Button>
										<Button size="lg">Large</Button>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										States
									</Text>
									<div className="flex flex-wrap gap-3">
										<Button isDisabled>Disabled Button</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</section>

					{/* Links Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Links
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-3">
								<div className="space-y-2">
									<Text variant="overline" className="">
										Variants
									</Text>
									<div className="flex flex-wrap gap-4">
										<Link variant="default" href="#">
											Default Link
										</Link>
										<Link variant="button" href="#">
											Button Link
										</Link>
									</div>
								</div>

								<div className="space-y-2">
									<Text variant="overline" className="">
										External Links
									</Text>
									<Link variant="default" href="https://react-aria.adobe.com/">
										React Aria Documentation (opens in new tab)
									</Link>
								</div>
							</CardBody>
						</Card>
					</section>

					{/* Form Components Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Form Components
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-6">
								<div className="space-y-3">
									<Text variant="overline" className="">
										TextField
									</Text>
									<div className="max-w-md space-y-4">
										<TextField label="Email" placeholder="Enter your email" type="email" />
										<TextField
											label="Name"
											description="Your full name as it appears on official documents"
											placeholder="John Doe"
										/>
										<TextField
											label="Username"
											errorMessage="Username is already taken"
											placeholder="johndoe"
										/>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										TextArea
									</Text>
									<div className="max-w-md">
										<TextArea
											label="Message"
											description="Share your thoughts with us"
											placeholder="Type your message here..."
										/>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Select
									</Text>
									<div className="max-w-md">
										<Select label="Country" placeholder="Select a country">
											<SelectItem id="us">United States</SelectItem>
											<SelectItem id="ca">Canada</SelectItem>
											<SelectItem id="mx">Mexico</SelectItem>
											<SelectItem id="uk">United Kingdom</SelectItem>
											<SelectItem id="de">Germany</SelectItem>
											<SelectItem id="fr">France</SelectItem>
										</Select>
									</div>
								</div>
							</CardBody>
						</Card>
					</section>

					{/* Cards Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Cards
						</Heading>

						<div className="grid gap-6 md:grid-cols-3">
							<Card variant="default" className="">
								<CardHeader className="">
									<Heading level="h4" className="">
										Default Card
									</Heading>
								</CardHeader>
								<CardBody>
									<Text className="">This is a default card with no border or shadow.</Text>
								</CardBody>
								<CardFooter className="">
									<Button size="sm">Action</Button>
								</CardFooter>
							</Card>

							<Card variant="elevated" className="">
								<CardHeader className="">
									<Heading level="h4" className="">
										Elevated Card
									</Heading>
								</CardHeader>
								<CardBody>
									<Text className="">This card has a subtle shadow for elevation.</Text>
								</CardBody>
								<CardFooter className="">
									<Button size="sm">Action</Button>
								</CardFooter>
							</Card>

							<Card variant="bordered" className="">
								<CardHeader className="">
									<Heading level="h4" className="">
										Bordered Card
									</Heading>
								</CardHeader>
								<CardBody>
									<Text className="">This card has a border around it.</Text>
								</CardBody>
								<CardFooter className="">
									<Button size="sm">Action</Button>
								</CardFooter>
							</Card>
						</div>
					</section>

					{/* Table Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Table
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-6">
								<div className="space-y-3">
									<Text variant="overline" className="">
										Basic Table
									</Text>
									<Table columns={userColumns} data={exampleUsers} />
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Clickable Rows
									</Text>
									<Table
										columns={userColumns}
										data={exampleUsers}
										onRowClick={(user) => setSelectedUser(user)}
									/>
									{selectedUser && (
										<Text variant="caption" className="">
											Selected: {selectedUser.name} ({selectedUser.email})
										</Text>
									)}
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Empty State
									</Text>
									<Table
										columns={userColumns}
										data={[]}
										emptyState={
											<div className="text-center">
												<Text variant="body" className="text-text-secondary">
													No users found. Add a user to get started.
												</Text>
											</div>
										}
									/>
								</div>
							</CardBody>
						</Card>
					</section>

					{/* Colors Section */}
					<section className="space-y-6">
						<Heading level="h2" className="">
							Colors
						</Heading>

						<Card variant="bordered" className="">
							<CardBody className="space-y-6">
								<div className="space-y-3">
									<Text variant="overline" className="">
										Primary - Forest Green
									</Text>
									<div className="grid grid-cols-3 gap-3 md:grid-cols-6">
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-900" />
											<Text variant="caption" size="xs">
												900
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-700" />
											<Text variant="caption" size="xs">
												700
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-600" />
											<Text variant="caption" size="xs">
												600
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-500" />
											<Text variant="caption" size="xs">
												500
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-400" />
											<Text variant="caption" size="xs">
												400
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-primary-300" />
											<Text variant="caption" size="xs">
												300
											</Text>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Backgrounds
									</Text>
									<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
										<div className="space-y-2">
											<div className="h-16 w-full rounded border border-border bg-[#0a0a0b]" />
											<Text variant="caption" size="xs">
												Background
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded border border-border bg-[#18181b]" />
											<Text variant="caption" size="xs">
												Surface
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded border border-border bg-[#27272a]" />
											<Text variant="caption" size="xs">
												Surface Hover
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-[#3f3f46]" />
											<Text variant="caption" size="xs">
												Border
											</Text>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Semantic
									</Text>
									<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-success-600" />
											<Text variant="caption" size="xs">
												Success
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-warning-500" />
											<Text variant="caption" size="xs">
												Warning
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-error-500" />
											<Text variant="caption" size="xs">
												Error
											</Text>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<Text variant="overline" className="">
										Accent
									</Text>
									<div className="grid grid-cols-2 gap-3 md:grid-cols-2">
										<div className="space-y-2">
											<div className="h-16 w-full rounded bg-accent-gold" />
											<Text variant="caption" size="xs">
												Gold
											</Text>
										</div>
										<div className="space-y-2">
											<div className="h-16 w-full rounded border border-border bg-accent-cream" />
											<Text variant="caption" size="xs">
												Cream
											</Text>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</section>
				</div>
			</div>
		</div>
	);
}
