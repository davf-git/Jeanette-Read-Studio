// Build flags. preview is true for "npm run build:preview" (the claude.ai design preview), never for the live site.
export default { preview: !!process.env.ELEVENTY_RELATIVE };
