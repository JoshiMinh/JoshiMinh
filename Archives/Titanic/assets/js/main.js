// Titanic Demo Interactivity
(function () {
  // ========== SCROLL INDICATOR ==========
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.querySelector('.about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const deckIds = ['A','B','C','D','E','F','G','T','U'];

  // Descriptions are illustrative; the visualization itself is not to scale.
  const deckDescriptions = {
    A: {
      title: 'Deck A',
      desc: 'Upper deck area. Typically associated with first-class accommodations and access to promenades.'
    },
    B: {
      title: 'Deck B',
      desc: 'Upper-mid deck. Historically housed many first and second-class cabins.'
    },
    C: {
      title: 'Deck C',
      desc: 'Mid-upper deck with a mixture of accommodations and public spaces.'
    },
    D: {
      title: 'Deck D',
      desc: 'Midship deck area with large interior spaces.'
    },
    E: {
      title: 'Deck E',
      desc: 'Lower mid-deck, deeper within the ship structure.'
    },
    F: {
      title: 'Deck F',
      desc: 'Lower deck nearer to the hull; often associated with third-class regions.'
    },
    G: {
      title: 'Deck G',
      desc: 'Lower-hull deck spaces; close to waterline and machinery areas.'
    },
    T: {
      title: 'Deck T',
      desc: 'Rarely referenced; included for completeness in the dataset.'
    },
    U: {
      title: 'Deck U (Unknown)',
      desc: 'Unknown or unassigned deck, used where cabin info is unavailable.'
    }
  };

  const clearActive = () => {
    document.querySelectorAll('.decks .deck').forEach(el => el.classList.remove('active'));
  };

  // Initialize deck events
  deckIds.forEach(id => {
    const el = document.getElementById(`deck-${id}`);
    if (!el) return;

    el.addEventListener('mouseenter', () => {
      el.classList.add('active');
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('active');
    });
  });

  // Gentle ship bobbing animation via transform
  const ship = document.getElementById('ship-group');
  if (ship) {
    let t = 0;
    function animate() {
      t += 0.02;
      const dy = Math.sin(t) * 1.6; // small vertical bob
      const dx = Math.cos(t * 0.6) * 0.8; // slight horizontal sway
      ship.setAttribute('transform', `translate(${dx}, ${dy})`);
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ========== PREDICTION FORM HANDLER ==========
  const predictionForm = document.getElementById('prediction-form');
  const predictionResult = document.getElementById('prediction-result');
  const API_URL = '/api';  // Relative URL since we're on the same server

  if (predictionForm) {
    predictionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(predictionForm);
      
      // Coerce numeric fields early for clearer UI logic; API still validates.
      const data = {
        pclass: Number(formData.get('pclass')),
        sex: formData.get('sex'),
        age: Number(formData.get('age')),
        fare: Number(formData.get('fare')),
        familySize: Number(formData.get('familySize')),
        embarked: formData.get('embarked'),
        title: formData.get('title'),
        deck: formData.get('deck')
      };

      // Show loading state
      predictionResult.style.display = 'block';
      predictionResult.innerHTML = '<p class="loading">⏳ Analyzing passenger data...</p>';

      try {
        const response = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Prediction server is not running');
        }

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }

        displayPrediction(result, data);
      } catch (error) {
        predictionResult.innerHTML = `
          <div class="error">
            <h4>⚠️ Server Error</h4>
            <p>${error.message}</p>
            <p class="hint">Make sure to start the prediction server:</p>
            <code>python prediction_api.py</code>
          </div>
        `;
      }
    });
  }

  function displayPrediction(result, inputData) {
    const survived = result.survived;
    const probability = (result.probability * 100).toFixed(1);
    const statusClass = survived ? 'survived' : 'died';
    const statusIcon = survived ? '✅' : '❌';
    const statusText = survived ? 'SURVIVED' : 'DID NOT SURVIVE';

    let factors = '';
    if (survived) {
      factors = '<h4>💡 Positive Factors:</h4><ul>';
      if (inputData.sex === 'female') factors += '<li>Female (women & children first)</li>';
      if (inputData.age <= 18) factors += `<li>Young age (${inputData.age} years)</li>`;
      if (inputData.pclass === 1) factors += '<li>First class (better lifeboat access)</li>';
      if (inputData.fare > 50) factors += `<li>Higher fare ($${inputData.fare})</li>`;
      factors += '</ul>';
    } else {
      factors = '<h4>⚠️ Risk Factors:</h4><ul>';
      if (inputData.sex === 'male') factors += '<li>Male (women & children first policy)</li>';
      if (inputData.pclass === 3) factors += '<li>Third class (limited lifeboat access)</li>';
      if (inputData.age > 50) factors += `<li>Older age (${inputData.age} years)</li>`;
      if (inputData.fare < 20) factors += `<li>Lower fare ($${inputData.fare})</li>`;
      factors += '</ul>';
    }

    predictionResult.className = `prediction-result ${statusClass}`;
    predictionResult.innerHTML = `
      <div class="result-header">
        <h3>${statusIcon} ${statusText}</h3>
        <p class="probability">Probability: ${probability}%</p>
        <p class="confidence">Confidence: ${result.confidence}</p>
      </div>
      <div class="passenger-summary">
        <p><strong>Passenger Profile:</strong></p>
        <p>${inputData.title} | ${inputData.sex} | Age ${inputData.age}</p>
        <p>Class ${inputData.pclass} | Fare $${inputData.fare} | Port ${inputData.embarked}</p>
        <p>Deck ${inputData.deck} | Family Size: ${inputData.familySize}</p>
      </div>
      ${factors}
      <p class="model-info">Model: ${result.model}</p>
    `;
  }

})();
