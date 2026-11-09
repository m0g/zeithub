{
  description = "Zeithub - time tracking, invoicing & expenses (Nuxt 4 + SQLite)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Puppeteer (invoice PDFs) needs a Chromium binary via CHROME_BIN.
        # nixpkgs has no Chromium on macOS, so fall back to the installed Chrome.
        chromeBin =
          if pkgs.stdenv.hostPlatform.isLinux
          then "${pkgs.chromium}/bin/chromium"
          else "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

        buildInputs = with pkgs; [
          nodejs_24

          # Inspect the database: sqlite3 .data/zeithub.db
          sqlite

          git
          fish
        ] ++ lib.optionals stdenv.hostPlatform.isLinux [ chromium ];

      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;

          CHROME_BIN = chromeBin;
          PUPPETEER_SKIP_DOWNLOAD = "1";

          shellHook = ''
            exec fish -C '
              # Node modules binaries
              set -gx PATH "$PWD/node_modules/.bin" $PATH

              # Set NIX_SHELL indicator for prompt customization
              set -gx IN_NIX_SHELL 1

              # Custom prompt with magenta color to indicate Nix environment
              function fish_prompt
                set_color magenta
                echo -n "[nix] "
                set_color blue
                echo -n (prompt_pwd)
                set_color green
                echo -n (fish_git_prompt)
                set_color normal
                echo -n " > "
              end

              echo "Zeithub development environment loaded"
              echo "Node: "(node --version)
              echo "CHROME_BIN: $CHROME_BIN"
            '
          '';

          LANG = "en_US.UTF-8";
          LC_ALL = "en_US.UTF-8";
        };
      });
}
