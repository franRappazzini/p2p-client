/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Ignorar archivos de prueba de thread-stream
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Suprimir warnings de módulos opcionales
    config.ignoreWarnings = [{ module: /node_modules\/pino/ }];

    // Fallback para módulos que no están disponibles en el navegador
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
      };
    }

    // Excluir archivos problemáticos de thread-stream
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /node_modules\/thread-stream\/(test|bench|README\.md|LICENSE)/,
      loader: "ignore-loader",
    });

    return config;
  },
};

export default nextConfig;
