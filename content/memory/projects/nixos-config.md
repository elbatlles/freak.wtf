---
id: project-nixos-config
title: NixOS config and dev environment
type: project
period: present
themes: [nixos, linux, hyprland, nix, flakes, dotfiles, setup, config, devenv, wm, window-manager, terminal, zsh, reproducible]
signals: [technical]
priority: 3
confidence: high
---
My daily driver is NixOS with Hyprland as the window manager — fully declarative, reproducible from scratch.

My NixOS configuration: https://github.com/elbatlles/nixos-config
Hyprland dotfiles I use: https://github.com/LinuxBeginnings/Hyprland-Dots

The setup uses Nix flakes for reproducibility — any machine I set up from scratch gets the exact same environment. Dev shells per project, no global pollution.

The appeal of NixOS is that the config is the documentation. If something breaks, you revert. If you want a new machine, you copy the config. It removes the mental overhead of "how did I set this up again".
