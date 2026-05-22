import React, { useEffect, useRef } from 'react';
 
import { useNavigate } from 'react-router-dom';
import scriptUrl from './solarsystem-script.js?url';

export default function Solarsystem() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Setup back link
        const backLink = containerRef.current.querySelector('.back-link');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigate('/');
            });
        }

        // Load solarsystem script dynamically
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script and any global intervals if they exist
            document.body.removeChild(script);
            if (typeof stopSimulation === 'function') {
                try { stopSimulation(); } catch (e) {}
            }
            if (typeof rafId !== 'undefined' && rafId) {
                try { cancelAnimationFrame(rafId); } catch (e) {}
            }
            // Remove the canvas created by the script if necessary
            const root = document.getElementById('root');
            if (root) root.innerHTML = '';
        };
    }, [navigate]);

    return (
        <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
  <div id="root"></div>
` }} />
    );
}
