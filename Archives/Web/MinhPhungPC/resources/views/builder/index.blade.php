@extends('layouts.app')

@section('content')
<div class="container">
    @if($buildSetConflict)
        <div class="alert alert-warning d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
                A build exists both in your account and on this device. Which one would you like to keep?
            </div>
            <div class="mt-3 mt-md-0">
                <a href="{{ route('builder.replace') }}" class="btn btn-primary btn-sm mr-2">Use Local Build</a>
                <a href="{{ route('builder.discard') }}" class="btn btn-secondary btn-sm">Keep Account Build</a>
            </div>
        </div>
    @endif

    <div class="text-center my-5">
        <h2>Build Your First PC!</h2>
    </div>

    @php
        $selectedComponents = collect($components ?? [])->keyBy('table');
        $categoryMap = config('categories', []);
    @endphp

    <div class="container">
        @foreach($categoryMap as $componentName => $tableName)
            @php $selectedComponent = $selectedComponents->get($tableName); @endphp
            <div class="component-card my-4 shadow-sm bg-white text-dark rounded" id="{{ $tableName }}">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <span class="text-center" style="flex-shrink: 0; width: 120px;">
                        {{ $componentName }}
                    </span>

                    <div class="d-flex align-items-center gap-3 w-100 w-md-auto">
                        <div class="p-2">
                            <img
                                src="{{ $selectedComponent['image'] ?? asset('component_icons/'.$tableName.'.png') }}"
                                alt="{{ $componentName }}"
                                class="component-image {{ $selectedComponent ? 'updated-image' : '' }}"
                                data-placeholder="{{ asset('component_icons/'.$tableName.'.png') }}"
                                style="background-color: #ffffff; opacity: {{ $selectedComponent ? '0.9' : '0.7' }}; transition: opacity 0.3s ease; width: 50px; height: 50px; padding: 10px; border-radius: 5px; object-fit: cover;">
                        </div>
                        <span class="text-muted d-md-inline component-summary">
                            @if($selectedComponent)
                                <span class="text-dark">{{ $selectedComponent['name'] }}</span><br>
                                - <span class="text-success">{{ number_format($selectedComponent['price'], 0, ',', '.') }}₫</span>
                            @else
                                Please select a component
                            @endif
                        </span>
                    </div>

                    <div class="d-flex flex-column flex-md-row align-items-center mt-2 mt-md-0 action-buttons">
                        @if($selectedComponent)
                            <form class="remove-component d-inline" data-table="{{ $tableName }}">
                                @csrf
                                <button type="submit" class="btn btn-danger px-2 mt-2 mt-md-0 mx-1">Remove</button>
                            </form>
                            <button class="btn btn-primary px-3 select-btn mt-2 mt-md-0 mx-1"
                                data-table="{{ $tableName }}"
                                data-name="{{ $componentName }}"
                                data-toggle="modal"
                                data-target="#componentModal">Change</button>
                        @else
                            <button class="btn btn-primary px-4 select-btn mx-1"
                                data-table="{{ $tableName }}"
                                data-name="{{ $componentName }}"
                                data-toggle="modal"
                                data-target="#componentModal">Select</button>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center my-4 px-2">
            <div class="d-flex align-items-center mb-3 mb-md-0">
                <h5 class="mb-0">Total:</h5>
                <span id="totalAmount" class="text-success ml-2">{{ number_format($totalAmount, 0, ',', '.') }}₫</span>
            </div>
            <div class="d-flex">
                <form id="clearBuildSet" class="mr-2">
                    @csrf
                    <button type="submit" class="btn btn-danger">Clear</button>
                </form>
                <button class="btn btn-success" id="addBuildSetToCart">Add to Cart</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="componentModal" tabindex="-1" aria-labelledby="componentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="componentModalLabel">Select Component</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body" style="max-height: 420px; overflow-y: auto;">
                <div id="modalItemContainer" class="d-flex flex-column justify-content-start"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="confirmSelect">Confirm Selection</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <img id="modalImage" src="" alt="Component Image" class="img-fluid" style="max-width: 100%; height: auto;">
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const csrfToken = '{{ csrf_token() }}';
    const itemBaseUrl = @json(url('items'));
    let selectedComponent = {};
    let currentTable = null;

    function applyImageStyles() {
        document.querySelectorAll('.component-card img').forEach(image => {
            if (image.dataset.placeholder && image.src.includes(image.dataset.placeholder)) {
                return;
            }

            image.style.cssText = 'padding: 5px; object-fit: cover; opacity: 0.9; border-radius: 10px; width: 60px; height: 60px;';
            image.classList.add('updated-image');
            image.addEventListener('click', () => {
                const modalImage = document.getElementById('modalImage');
                modalImage.src = image.src;
                modalImage.style.backgroundColor = 'white';
                $('#imageModal').modal('show');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', applyImageStyles);

    function renderModalItems(items, tableName) {
        const container = document.getElementById('modalItemContainer');
        if (!items.length) {
            container.innerHTML = '<p>No components available or no compatible components. <br>Maybe check your network or other components.</p>';
            return;
        }

        container.innerHTML = items.map(component => `
            <label class="component-item p-3 m-2 rounded d-flex align-items-center justify-content-between bg-white text-dark" style="height: 100%; cursor: pointer;">
                <div class="d-flex align-items-center">
                    <img src="${component.image}" alt="${component.name}" class="img-fluid rounded p-1"
                        style="width: 100px; height: 100px; object-fit: cover; margin-right: 15px; background-color: white;">
                    <div class="d-flex flex-column" style="text-align: left;">
                        <a href="${itemBaseUrl}/${tableName}/${component.id}" target="_blank">
                            <b class="mb-1">${component.name}</b>
                        </a>
                        <p class="mb-1"><strong>Brand:</strong> ${component.brand ?? ''}</p>
                        <p class="mb-1"><strong>Price:</strong> ${new Intl.NumberFormat('vi-VN').format(component.price ?? 0)}₫</p>
                    </div>
                </div>
                <div class="d-flex align-items-center" style="margin-left: auto;">
                    <input type="radio" class="form-check-input" name="componentSelection"
                        data-id="${component.id}" data-name="${component.name}" data-price="${component.price}"
                        data-image="${component.image}" data-table="${tableName}" data-brand="${component.brand ?? ''}">
                </div>
            </label>
        `).join('');
    }

    $('#componentModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const componentName = button.data('name');
        currentTable = button.data('table');
        $('#componentModalLabel').text(`Select ${componentName}`);
        const modalFooter = $('.modal-footer');
        modalFooter.find('.updated-message').remove();
        document.getElementById('modalItemContainer').innerHTML = '<p class="text-center">Loading...</p>';

        fetch(`{{ route('builder.components') }}?table=${encodeURIComponent(currentTable)}`)
            .then(response => response.json())
            .then(data => {
                const count = data.count || 0;
                $('#componentModalLabel').text(`Select ${componentName} - ${count} Available`);
                renderModalItems(data.items ?? [], currentTable);
            })
            .catch(() => {
                document.getElementById('modalItemContainer').innerHTML = '<p>Error loading components.</p>';
            });
    });

    $('#modalItemContainer').on('change', 'input[name="componentSelection"]', function () {
        selectedComponent = {
            id: $(this).data('id'),
            name: $(this).data('name'),
            price: $(this).data('price'),
            image: $(this).data('image'),
            tableName: $(this).data('table'),
            brand: $(this).data('brand'),
        };
    });

    document.getElementById('confirmSelect').addEventListener('click', function () {
        if (!selectedComponent.id || !selectedComponent.tableName) {
            alert('Please select a component before confirming.');
            return;
        }

        fetch('{{ route('builder.update') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                component_id: selectedComponent.id,
                table_name: selectedComponent.tableName,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateComponentCard(selectedComponent.tableName, selectedComponent, data.totalAmount);
                    selectedComponent = {};
                    $('#componentModal').modal('hide');
                } else {
                    alert('Failed to update buildset.');
                }
            })
            .catch(() => alert('Error updating buildset.'));
    });

    function updateComponentCard(tableName, component, totalAmount) {
        const card = document.getElementById(tableName);
        if (!card) {
            return;
        }

        const summary = card.querySelector('.component-summary');
        summary.innerHTML = `
            <span class='text-dark'>${component.name}</span><br>
            - <span class='text-success'>${new Intl.NumberFormat('vi-VN').format(component.price ?? 0)}₫</span>
        `;

        const image = card.querySelector('.component-image');
        image.src = component.image;
        image.style.opacity = '0.9';
        image.style.padding = '5px';
        image.style.width = '60px';
        image.style.height = '60px';
        image.style.borderRadius = '10px';
        image.classList.add('updated-image');

        image.addEventListener('click', () => {
            const modalImage = document.getElementById('modalImage');
            modalImage.src = component.image;
            modalImage.style.backgroundColor = 'white';
            $('#imageModal').modal('show');
        });

        const actions = card.querySelector('.action-buttons');
        actions.innerHTML = `
            <form class="remove-component d-inline" data-table="${tableName}">
                <button type="submit" class="btn btn-danger px-2 mt-2 mt-md-0 mx-1">Remove</button>
            </form>
            <button class="btn btn-primary px-3 select-btn mt-2 mt-md-0 mx-1"
                data-table="${tableName}"
                data-name="${card.querySelector('span.text-center').textContent.trim()}"
                data-toggle="modal"
                data-target="#componentModal">Change</button>
        `;

        attachHandlers();
        document.getElementById('totalAmount').innerText = `${new Intl.NumberFormat('vi-VN').format(totalAmount ?? 0)}₫`;
    }

    function attachHandlers() {
        document.querySelectorAll('.select-btn').forEach(button => {
            if (button.dataset.handlerAttached === 'true') {
                return;
            }
            button.dataset.handlerAttached = 'true';
            button.addEventListener('click', function () {
                currentTable = this.dataset.table;
            });
        });

        document.querySelectorAll('.remove-component').forEach(form => {
            if (form.dataset.handlerAttached === 'true') {
                return;
            }
            form.dataset.handlerAttached = 'true';
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                const tableName = this.dataset.table;

                fetch('{{ route('builder.remove') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({ table_name: tableName })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            resetComponentCard(tableName, data.totalAmount);
                        }
                    });
            });
        });
    }

    function resetComponentCard(tableName, totalAmount) {
        const card = document.getElementById(tableName);
        if (!card) {
            return;
        }

        const image = card.querySelector('.component-image');
        image.src = image.dataset.placeholder;
        image.style.opacity = '0.7';
        image.style.padding = '10px';
        image.style.width = '50px';
        image.style.height = '50px';
        image.style.borderRadius = '5px';

        const summary = card.querySelector('.component-summary');
        summary.textContent = 'Please select a component';

        const actions = card.querySelector('.action-buttons');
        actions.innerHTML = `
            <button class="btn btn-primary px-4 select-btn mx-1"
                data-table="${tableName}"
                data-name="${card.querySelector('span.text-center').textContent.trim()}"
                data-toggle="modal"
                data-target="#componentModal">Select</button>
        `;

        attachHandlers();
        document.getElementById('totalAmount').innerText = `${new Intl.NumberFormat('vi-VN').format(totalAmount ?? 0)}₫`;
    }

    attachHandlers();

    document.getElementById('clearBuildSet').addEventListener('submit', function (event) {
        event.preventDefault();
        fetch('{{ route('builder.clear') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            }
        })
            .then(response => response.json())
            .then(() => window.location.reload());
    });

    document.getElementById('addBuildSetToCart').addEventListener('click', function () {
        fetch('{{ route('builder.add-to-cart') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Added all components to the cart!');
                    window.location.reload();
                } else {
                    alert(data.message ?? 'Unable to add components.');
                }
            })
            .catch(() => alert('Unable to add components.'));
    });
</script>
@endpush
