// import { useState, useRef } from 'react';
// import Services from '../components/ApplySteps/Services';
// import About from '../components/ApplySteps/About';
// import Avaliablility from '../components/ApplySteps/Avaliablilty';
// import styles from '../styles/apply.module.scss';
// import { motion, useAnimation } from 'framer-motion';
// import { getTimezone } from '../lib/hooks';
// // import buttons from '../styles/buttons.module.scss';
// // import Step from '../components/ApplySteps/Step';
// // import axios from 'axios';

// export interface applyData extends Object {
//   step: number;
//   about: string | null;
//   description: string | null;
//   pronouns: string | null;
//   birthday: Date | null;
// }

// export const starterData: applyData = {
//   step: 0,
//   about: null,
//   description: null,
//   birthday: new Date(),
//   pronouns: null,
// };

// export default function Apply() {
//   const [data, setData] = useState<applyData>(starterData);
//   const mainRef = useRef();
//   const animationController = useAnimation();
//   const timeZone = getTimezone();

//   const stepUpdate = (add = true) => setData({ ...data, step: add ? data.step + 1 : data.step - 1 });

//   const advanceStep = () => {
//     if (data.step > applySteps.length) {
//       console.log('setup done.. Submitting data.');
//     }

//     console.log(data);
//     stepUpdate();
//   };

//   const goBack = () => stepUpdate(false);

//   const setModerator = e => {
//     advanceStep();
//   };

//   const setOwner = e => {};

//   const handleAboutData = (submitter: string, newData: applyData) => {
//     switch (submitter) {
//       case 'forward':
//         advanceStep();
//         console.log(newData, 'hello');
//         setData({ ...data, about: newData.about, description: newData.description, pronouns: newData.pronouns, birthday: newData.birthday });
//         break;
//       case 'back':
//         goBack();
//         break;
//       default:
//         break;
//     }
//   };

//   const handleAvaliablilityData = (submitter, newData) => {
//     switch (submitter) {
//       case 'forward':
//         advanceStep();
//         setData({ ...data, ...newData });
//         break;
//       case 'back':
//         goBack();
//         setData({ ...data, ...newData });
//         break;
//       default:
//         break;
//     }
//   };

//   const applySteps = [
//     {
//       step: 1,
//       component: <Services setModerator={setModerator} setOwner={setOwner}></Services>,
//       text: 'Welcome to dmod.gg!',
//       description: 'Lets get started on your listing! First off we need to know who you are!',
//       image: '/8rkjej.png',
//     },
//     {
//       step: 2,
//       component: <About onSubmit={handleAboutData} data={[data, setData]} />,
//       text: 'Who are you??',
//       description: 'Tell us about yourself! Include things on your hobbys and your interests! It might help the server owner!',
//       image: 'info.png',
//     },
//     {
//       step: 3,
//       component: <Avaliablility onSubmit={handleAvaliablilityData} tz={timeZone} />,
//       text: 'Availability',
//       description: 'When are you avalable?',
//       image: 'clock.png',
//     },
//     {
//       step: 4,
//       component: null,
//       text: 'Done!',
//       description: 'Publish your listing!',
//       image: 'draw.png',
//     },
//   ];

//   return (
//     <div>
//       <div className={styles.container}>
//         <h1>{applySteps[data.step].text}</h1>
//         <p>{applySteps[data.step].description}</p>
//         <div className={`${styles.main}`}>
//           <motion.div animate={animationController} ref={mainRef} className={`${styles.content}`}>
//             {applySteps[data.step].component}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function apply() {
  return <div className='text-center'>Page out of commission.</div>;
}
