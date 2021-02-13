module.exports = {
  apps: [{
    name: 'Sublime Deals API',
    script: 'index.js',
    watch: '.',
    ignore_watch: ['node_modules'],
    exec_mode: 'cluster',
    instances: 'max',
    time: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'sublimedeals',
      ref: 'origin/master',
      repo: 'git@github.com:vpul/thriftonaut.git',
      path: '/home/ubuntu/sublimedeals',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
    },
  },
};
