# Opening assets

The opening is built from independent layers so each part can animate separately with GSAP.

## Current invitation layers

- 01_pagoda_backdrop.png
- 02_ivory_paper_texture.png
- 03_card_container.png
- 04_baby_photo_sample.png
- 05_photo_frame.png
- 05_photo_mask.svg
- 06_invitation_typography.png
- 07_satin_ribbon.png
- 08_lotus_wax_seal.png
- 09_gold_ornaments.png
- 10_open_invitation_button.png
- 11_lotus_foreground.png
- 12_floating_petal.png

## Presentation box layers

These are kept as separate PNGs so the box can open physically rather than as one flat image.

- 13_box_back.png — stationary back panel / outer shell
- 14_box_left_flap.png — left hinged flap
- 15_box_right_flap.png — right hinged flap
- 16_box_inner_tray.png — recessed tray behind the invitation

The existing 08_lotus_wax_seal.png can be reused as the box closure unless a dedicated seal is created later.

## Planned layer order

1. Background
2. Box back
3. Inner tray
4. Invitation card
5. Right flap
6. Left flap
7. Wax seal / closure
8. Open Invitation button

Do not merge the box pieces into one image. The left and right flaps need independent transform origins for the opening animation.
