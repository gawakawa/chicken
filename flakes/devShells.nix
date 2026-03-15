_: {
  perSystem =
    { config, pkgs, ... }:
    let
      devPackages =
        config.ciPackages
        ++ config.pre-commit.settings.enabledPackages
        ++ (with pkgs; [
          firebase-tools
        ]);
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = devPackages;

        shellHook = ''
          ${config.pre-commit.shellHook}
        '';
      };
    };
}
