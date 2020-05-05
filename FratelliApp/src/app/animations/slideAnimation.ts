import { AnimationController} from '@ionic/angular';
const animationCtrl = new AnimationController();


export const slideInAnimation = (baseEl: any) => {
    const backdropAnimation = animationCtrl
      .create()
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', '0.5')
      .duration(300);
  
    const wrapperAnimation = animationCtrl
      .create()
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .delay(50)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'translateX(-100%)' },
        { offset: 1, opacity: '0.99', transform: 'translateX(0%)' }
      ])
      .duration(250);
  
    return animationCtrl
      .create()
      .addElement(baseEl)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  export const slideOutAnimation = (baseEl: any) => {
    return slideInAnimation(baseEl).direction('reverse');
  };