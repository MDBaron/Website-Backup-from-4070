== Biolab Disaster Entity Pack

This pack contains some of Biolab Disaster's entities. Most of them are
used for logic purposes only and thus are not visible in the game. The
two exceptions are EntityMover and EntityDebris - these also require 
the graphics in the media/ directory.

See the source for each of the entities for a description of what they
do and how to use them.

Many entities work in conjunction with the EntityTrigger entity: they
have a special triggeredBy() method, that is usually called by such
a trigger.


The source code for these entities is licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php