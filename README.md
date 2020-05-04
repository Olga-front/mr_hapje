# Mr. Hapje

Demo: https://markup-examples.brain-house.com/mr_happje/

The following technologies were used in this project:
HTML5, JADE, BEM, SCSS, CSS3, CSS ANIMATION, JQUERY, GULP

## How to run a project
1. Install [node.js](https://nodejs.org/) and gulp globally

		npm install gulp -g

2. Install npm packages.

		npm i
		
3. Let's code!

		gulp

4. Edit files in assets folder, see result in dist folder. If you want to build optimized version of project run:

		gulp build

## How to work with js

Create all your main scripts in assets/js. Create all your additional scripts (jquery,plugins, и т.д) in assets/js/all. Gulp will concat all your additional scripts into all.js

## How to make svg-sprite

1. Put your icons into "assests/i/icons" folder
2. Run task svgSpriteBuild
3. Now you have sprite.svg in assets/i/sprite folder. By default you have svg4everybody script in your js. Also you have scss file _sprite.scss for styling sprite.
4. Run svg4everybody in your main.js file. For including icons use jade mixin "icon"
