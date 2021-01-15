/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2021 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/lib/Col';

class AnimationControls extends Component {
  constructor(props){
      console.log(props);
      super(props);
      this.props = props;
  }

  getIndex = () =>{
      return (this.props.get('sliderTickArray')).indexOf(this.props.get('currentStateHistoryValue'));
  }

  navigateAnimation = (index, command) => {
     if(!command){
        this.props.set('isPlaying',false);
        this.props.set('isStopped', false);
        this.props.set('isPaused', true);
        this.props.setValueState((this.props.get('sliderTickArray'))[index]);
     }else if (command === 'play'){
        this.props.setValueState((this.props.get('sliderTickArray'))[index]);
     }
     this.props.setNavigate((this.props.get('sliderTickArray'))[index]);
  }

  play = () =>{
    if(this.props.get('isPlaying')){
        var index = Math.min((this.props.get('sliderTickArray')).length - 1, this.getIndex() + 1);
        this.navigateAnimation(this.getIndex() + 1, 'play');
        if(index === (this.props.get('sliderTickArray')).length - 1){
            this.props.set('isPlaying', false);
            this.props.set('isStopped', true);
            this.props.set('isPaused', false);
        }
    }else{
         this.props.clear(this.props.get('intervalId'));
    }
  }

  animationControl = (controlType) => {
    console.log("Control was hit: " + controlType);
    switch(controlType){
        case 'play':
            if(!this.props.get('isPlaying')){
                if(!this.props.get('intervalId')){
                    this.props.set('intervalId', setInterval(this.play, 10000));
                }
                this.props.set('isPlaying', true);
                this.props.set('isStopped', false);
                this.props.set('isPaused', false);
            }
            break;
        case 'pause':
            if(this.props.get('isPlaying')){
                this.props.clear(this.props.get('intervalId'));
                this.props.set('isPlaying', false);
                this.props.set('isPaused', true);
            }
            break;
        case 'stop':
            if(this.props.get('isPlaying') || this.props.get('isPaused')){
                this.props.clear(this.props.get('intervalId'));
                this.props.set('isPlaying', false);
                this.props.set('isStopped', true);
                this.props.set('isPaused', false);
            }
            break;
        case 'skipForwardStep':
            var index = Math.min((this.props.get('sliderTickArray')).length - 1, this.getIndex() + 1);
            this.navigateAnimation(index);
            break;
        case 'skipBackwardStep':
            var index = Math.max(0, this.getIndex() - 1);
            this.navigateAnimation(index);
            break;
        case 'skipForwardLast':
            this.navigateAnimation((this.props.get('sliderTickArray')).length - 1);
            break;
        case 'skipBackwardEpoch':
            this.navigateAnimation(0);
            break;
        default:
            this.props.set('isPlaying', false);
            this.props.set('isStopped', false);
            this.props.set('isPaused', false);
            break;
    }
  }
  render(){
    return (
     <Col md={8}>
       <i className='icon-controls-skipbackstartover animationControlIcon'  onClick={() => this.animationControl('skipBackwardEpoch')} role="img"></i>
       <i className='icon-controls-rewind animationControlIcon'  onClick={() => this.animationControl('skipBackwardStep')} role="img"></i>
       { !this.props.playControlsDisabled && (<span><i className={'icon-controls-pointer ' + (this.props.get('isPlaying') ? 'animationPlayingIcon' : 'animationControlIcon')}  onClick={() => this.animationControl('play')} role="img"></i>
       <i className={'icon-controls-pause ' + (this.props.get('isPaused') ? 'animationPausedIcon' : 'animationControlIcon')}  onClick={() => this.animationControl('pause')} role="img"></i>
       <i className={'icon-controls-stop ' + (this.props.get('isStopped') ? 'animationStoppedIcon' : 'animationControlIcon')}   onClick={() => this.animationControl('stop')} role="img"></i></span>)}
       <i className='icon-controls-fastforward animationControlIcon'  onClick={() => this.animationControl('skipForwardStep')} role="img"></i>
       <i className='icon-controls-skipforward animationControlIcon'  onClick={() => this.animationControl('skipForwardLast')} role="img"></i>
     </Col>
    );
  }
};

export default AnimationControls;
