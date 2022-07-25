
import { useState, useEffect } from "react";
import React from "react"
import styled, { keyframes } from "styled-components"

const animation = keyframes`
  0% { opacity: 0; transform: translateY(-2vh); }
  25% { opacity: 1; transform: translateY(0px); }
  75% { opacity: 1; transform: translateY(0px); }
  100% { opacity: 0; transform: translateY(2vh); }
`

const Wrapper = styled.span`
  span {
    opacity: 0;
    display: inline-block;
    animation-name: ${animation};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
  }
  span:nth-child(1) {
    animation-delay: 0.1s;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.3s;
  }
  span:nth-child(4) {
    animation-delay: 0.4s;
  }
  span:nth-child(5) {
    animation-delay: 0.5s;
  }
  span:nth-child(6) {
    animation-delay: 0.6s;
  }
  span:nth-child(7) {
    animation-delay: 0.7s;
  }
  span:nth-child(8) {
    animation-delay: 0.8s;
  }
  span:nth-child(9) {
    animation-delay: 0.9s;
  }
  span:nth-child(10) {
    animation-delay: 1.0s;
  }
  span:nth-child(11) {
    animation-delay: 1.1s;
  }
  span:nth-child(12) {
    animation-delay: 1.2s;
  }
  span:nth-child(13) {
    animation-delay: 1.3s;
  }
`;

const SampleScroller = (data) => {
    const samples = data.samples;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => {
            // reset index if current index is greater than array size
            return prevIndex + 1 < samples.length ? prevIndex + 1 : 0;
        });
        }, 3000);

        return () => clearInterval(interval);
    });

    return (
    <div className="samplescroller">
        <Wrapper key={index}>
            {samples[index].toString().split("").slice(0,13).map((item, index) => (
                <span key={index}>{item}</span>
            ))}
        </Wrapper>
    </div>
    );
}

export default SampleScroller;