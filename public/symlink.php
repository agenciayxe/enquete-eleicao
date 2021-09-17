<?php
$target = '../storage/app/public';
$shortcut = './storage';
print_r([ 'target' => $target, 'shortcut' => $shortcut ]);
print_r(symlink($target, $shortcut));