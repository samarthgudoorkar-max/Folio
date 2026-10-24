/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repo = 'Folio';

const nextConfig = {
  output: 'export',
  basePath: isGithubActions ? `/${repo}` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
