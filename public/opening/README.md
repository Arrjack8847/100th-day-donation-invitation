# Presentation box intro

The intro uses the pagoda background, `13_box_back.png`, the invitation card and its portrait, frame and typography, `14_box_left_flap.png`, `15_box_right_flap.png`, and the Open Invitation button. The card stays hidden while the cover is closed.

Both flap PNGs render at their original aspect ratios. Their full transparent canvases remain visible, and each flap rotates on a hinge at the backing's inner side. Do not crop or reshape the flap art with CSS.

The supplied flap contours are not an exact complementary pair: aligning their outside edges to the backing leaves space near the top and makes their middle sections overlap. A perfectly flush gold seam requires corrected source flap artwork. The CSS must not hide this discrepancy with a generated seam or clip mask.
