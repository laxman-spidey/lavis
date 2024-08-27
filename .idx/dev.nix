# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = { };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "rangav.vscode-thunder-client"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "googlecloudtools.cloudcode"
      "mongodb.mongodb-vscode"
      "redwan-hossain.skillavid-pure-black"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        server-install = "cd server && npm ci --no-audit --prefer-offline --no-progress --timing";
        client-install = "cd client && npm install";
      };
      # Runs when a workspace is (re)started
      onStart = {
        run-server = "cd server && npm start";
        run-client = "cd client && npm start";
      };
    };
  };
}
