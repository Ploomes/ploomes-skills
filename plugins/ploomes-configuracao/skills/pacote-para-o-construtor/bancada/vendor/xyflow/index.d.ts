import { AriaRole, ButtonHTMLAttributes, CSSProperties, ComponentType, DOMAttributes, Dispatch, HTMLAttributes, MouseEvent as MouseEvent$1, MouseEvent as ReactMouseEvent, ReactNode, SVGAttributes, SetStateAction, WheelEvent as WheelEvent$1 } from 'react';

export type NodeDimensionChange = {
	id: string;
	type: "dimensions";
	dimensions?: Dimensions;
	resizing?: boolean;
	setAttributes?: boolean | "width" | "height";
};
export type NodePositionChange = {
	id: string;
	type: "position";
	position?: XYPosition;
	positionAbsolute?: XYPosition;
	dragging?: boolean;
};
export type NodeSelectionChange = {
	id: string;
	type: "select";
	selected: boolean;
};
export type NodeRemoveChange = {
	id: string;
	type: "remove";
};
export type NodeAddChange<NodeType extends NodeBase = NodeBase> = {
	item: NodeType;
	type: "add";
	index?: number;
};
export type NodeReplaceChange<NodeType extends NodeBase = NodeBase> = {
	id: string;
	item: NodeType;
	type: "replace";
};
/**
 * The [`onNodesChange`](/api-reference/react-flow#on-nodes-change) callback takes
 *an array of `NodeChange` objects that you should use to update your flow's state.
 *The `NodeChange` type is a union of six different object types that represent that
 *various ways an node can change in a flow.
 * @public
 */
export type NodeChange<NodeType extends NodeBase = NodeBase> = NodeDimensionChange | NodePositionChange | NodeSelectionChange | NodeRemoveChange | NodeAddChange<NodeType> | NodeReplaceChange<NodeType>;
export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeType extends EdgeBase = EdgeBase> = {
	item: EdgeType;
	type: "add";
	index?: number;
};
export type EdgeReplaceChange<EdgeType extends EdgeBase = EdgeBase> = {
	id: string;
	item: EdgeType;
	type: "replace";
};
/**
 * The [`onEdgesChange`](/api-reference/react-flow#on-edges-change) callback takes
 *an array of `EdgeChange` objects that you should use to update your flow's state.
 *The `EdgeChange` type is a union of four different object types that represent that
 *various ways an edge can change in a flow.
 *
 * @public
 */
export type EdgeChange<EdgeType extends EdgeBase = EdgeBase> = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange<EdgeType> | EdgeReplaceChange<EdgeType>;
type BaseType = Element | EnterElement | Document | Window | null;
type KeyType$1 = string | number;
interface ArrayLike$1<T> {
	length: number;
	item(index: number): T | null;
	[index: number]: T;
}
interface EnterElement {
	ownerDocument: Document;
	namespaceURI: string;
	appendChild(newChild: Node): Node;
	insertBefore(newChild: Node, refChild: Node): Node;
	querySelector(selectors: string): Element;
	querySelectorAll(selectors: string): NodeListOf<Element>;
}
interface CustomEventParameters {
	/**
	 * If true, the event is dispatched to ancestors in reverse tree order
	 */
	bubbles: boolean;
	/**
	 * If true, event.preventDefault is allowed
	 */
	cancelable: boolean;
	/**
	 * Any custom data associated with the event
	 */
	detail: any;
}
type ValueFn<T extends BaseType, Datum, Result> = (this: T, datum: Datum, index: number, groups: T[] | ArrayLike$1<T>) => Result;
interface TransitionLike<GElement extends BaseType, Datum> {
	selection(): Selection$1<GElement, Datum, any, any>;
	on(type: string, listener: null): TransitionLike<GElement, Datum>;
	on(type: string, listener: ValueFn<GElement, Datum, void>): TransitionLike<GElement, Datum>;
	tween(name: string, tweenFn: null): TransitionLike<GElement, Datum>;
	tween(name: string, tweenFn: ValueFn<GElement, Datum, ((t: number) => void)>): TransitionLike<GElement, Datum>;
}
declare namespace Selection$1 {
	/** (helper) given a string like `a.1 b c.2`, it returns a union like `'a' | 'b' | 'c'` */
	type ExtractEventNames<Input extends string> = Input extends "" ? never : Input extends `${infer A} ${infer B}` // multiple events
	 ? ExtractEventNames<A> | ExtractEventNames<B> : Input extends `${infer A}.${string}` // single event with a name
	 ? A : Input; // single event with no name
	/** (helper) given a `select`able element, returns the EventMap for that element */
	type GetEventMapForElement<GElement> = GElement extends Window ? WindowEventMap : GElement extends Document ? DocumentEventMap : GElement extends SVGElement ? SVGElementEventMap : GElement extends HTMLElement ? HTMLElementEventMap : GElement extends Element ? ElementEventMap & GlobalEventHandlersEventMap : GlobalEventHandlersEventMap;
	/** (helper) converts an event name to the event class (e.g. `'mouseup'` -> `MouseEvent`) */
	type EventNameToInterface<Name extends string, GElement> = Name extends keyof GetEventMapForElement<GElement> ? GetEventMapForElement<GElement>[Name] : CustomEvent<any>;
	/**
	 * (helper) given a typenames like `mouseup.a mousedown.b`, this helper will:
	 *  1. extract the types from the string (`mouseup` | `mousedown`)
	 *  2. convert the names to type (`MouseEvent` | `MouseEvent`)
	 */
	type EventOf<Source extends string, GElement> = string extends Source ? any : EventNameToInterface<ExtractEventNames<Source>, GElement>;
}
interface Selection$1<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> {
	// Sub-selection -------------------------
	/**
	 * For each selected element, select the first descendant element that matches the specified selector string.
	 * If no element matches the specified selector for the current element, the element at the current index will
	 * be null in the returned selection. If multiple elements match the selector, only the first matching element
	 * in document order is selected. Selection.select does not affect grouping: it preserves the existing group
	 * structure and indexes, and propagates data (if any) to selected children.
	 *
	 * If the current element has associated data, this data is propagated to the
	 * corresponding selected element.
	 *
	 * The generic represents the type of the descendant element to be selected.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	select<DescElement extends BaseType>(selector: string): Selection$1<DescElement, Datum, PElement, PDatum>;
	/**
	 * Create an empty sub-selection. Selection.select does not affect grouping: it preserves the existing group
	 * structure and indexes.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	select<DescElement extends BaseType>(selector: null): Selection$1<null, undefined, PElement, PDatum>;
	/**
	 * For each selected element, select the descendant element returned by the selector function.
	 * If no element is returned by the selector function for the current element, the element at the
	 * current index will be null in the returned selection. Selection.select does not affect grouping:
	 * it preserves the existing group structure and indexes, and propagates data (if any) to selected children.
	 *
	 * If the current element has associated data, this data is propagated to the
	 * corresponding selected element.
	 *
	 * The generic represents the type of the descendant element to be selected.
	 *
	 * @param selector A selector function, which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * It must return an element, or null if there is no matching element.
	 */
	select<DescElement extends BaseType>(selector: ValueFn<GElement, Datum, DescElement>): Selection$1<DescElement, Datum, PElement, PDatum>;
	/**
	 * Create an empty sub-selection. Selection.selectAll does affect grouping: The elements in the returned
	 * selection are grouped by their corresponding parent node in this selection, the group at the current index will be empty.
	 */
	selectAll(selector?: null): Selection$1<null, undefined, GElement, Datum>;
	/**
	 * For each selected element, selects the descendant elements that match the specified selector string. The elements in the returned
	 * selection are grouped by their corresponding parent node in this selection. If no element matches the specified selector
	 * for the current element, the group at the current index will be empty. Selection.selectAll does affect grouping: each selected descendant
	 * is grouped by the parent element in the originating selection.
	 *
	 * The selected elements do not inherit data from this selection; use selection.data to propagate data to children.
	 *
	 * The first generic "DescElement" refers to the type of descendant element to be selected. The second generic "OldDatum" refers to the type of the
	 * datum, of a selected element. This is useful when re-selecting elements with a previously set, know datum type.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectAll<DescElement extends BaseType, OldDatum>(selector: string): Selection$1<DescElement, OldDatum, GElement, Datum>;
	/**
	 * For each selected element, selects the descendant elements returned by the selector function. The elements in the returned
	 * selection are grouped by their corresponding parent node in this selection. If no element matches the specified selector
	 * for the current element, the group at the current index will be empty. Selection.selectAll does affect grouping: each selected descendant
	 * is grouped by the parent element in the originating selection.
	 *
	 * The selected elements do not inherit data from this selection; use selection.data to propagate data to children.
	 *
	 * The first generic "DescElement" refers to the type of descendant element to be selected. The second generic "OldDatum" refers to the type of the
	 * datum, of a selected element. This is useful when re-selecting elements with a previously set, know datum type.
	 *
	 * @param selector A selector function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). It must return an array of elements
	 * (or an iterable, or a pseudo-array, such as a NodeList), or the empty array if there are no matching elements.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectAll<DescElement extends BaseType, OldDatum>(selector: ValueFn<GElement, Datum, DescElement[] | ArrayLike$1<DescElement> | Iterable<DescElement>>): Selection$1<DescElement, OldDatum, GElement, Datum>;
	/**
	 * Filters the selection, returning a new selection that contains only the elements for
	 * which the specified filter is true.
	 *
	 * The returned filtered selection preserves the parents of this selection, but like array.filter,
	 * it does not preserve indexes as some elements may be removed; use selection.select to preserve the index, if needed.
	 *
	 * @param selector A CSS selector string to match when filtering.
	 */
	filter(selector: string): Selection$1<GElement, Datum, PElement, PDatum>;
	/**
	 * Filters the selection, returning a new selection that contains only the elements for
	 * which the specified filter is true.
	 *
	 * The returned filtered selection preserves the parents of this selection, but like array.filter,
	 * it does not preserve indexes as some elements may be removed; use selection.select to preserve the index, if needed.
	 *
	 * The generic refers to the type of element which will be selected after applying the filter, i.e. if the element types
	 * contained in a pre-filter selection are narrowed to a subset as part of the filtering.
	 *
	 * @param selector A CSS selector string to match when filtering.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	filter<FilteredElement extends BaseType>(selector: string): Selection$1<FilteredElement, Datum, PElement, PDatum>;
	/**
	 * Filter the selection, returning a new selection that contains only the elements for
	 * which the specified filter is true.
	 *
	 * The returned filtered selection preserves the parents of this selection, but like array.filter,
	 * it does not preserve indexes as some elements may be removed; use selection.select to preserve the index, if needed.
	 *
	 * @param selector  A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return true
	 * for an element to be included, and false otherwise.
	 */
	filter(selector: ValueFn<GElement, Datum, boolean>): Selection$1<GElement, Datum, PElement, PDatum>;
	/**
	 * Filter the selection, returning a new selection that contains only the elements for
	 * which the specified filter is true.
	 *
	 * The returned filtered selection preserves the parents of this selection, but like array.filter,
	 * it does not preserve indexes as some elements may be removed; use selection.select to preserve the index, if needed.
	 *
	 * @param selector  A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return true
	 * for an element to be included, and false otherwise.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	filter<FilteredElement extends BaseType>(selector: ValueFn<GElement, Datum, boolean>): Selection$1<FilteredElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new selection merging this selection with the specified other selection or transition.
	 * The returned selection has the same number of groups and the same parents as this selection.
	 * Any missing (null) elements in this selection are filled with the corresponding element,
	 * if present (not null), from the specified selection. (If the other selection has additional groups or parents,
	 * they are ignored.)
	 *
	 * This method is commonly used to merge the enter and update selections after a data-join.
	 * After modifying the entering and updating elements separately, you can merge the two selections and
	 * perform operations on both without duplicate code.
	 *
	 * This method is not intended for concatenating arbitrary selections, however: if both this selection
	 * and the specified other selection have (non-null) elements at the same index, this selection’s element
	 * is returned in the merge and the other selection’s element is ignored.
	 *
	 * @param other Selection to be merged.
	 */
	merge(other: Selection$1<GElement, Datum, PElement, PDatum> | TransitionLike<GElement, Datum>): Selection$1<GElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new selection with the (first) child of each element of the current selection matching the selector.
	 * Selects the first child that matches (if any).
	 *
	 * The generic represents the type of the descendant element to be selected.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChild<DescElement extends BaseType>(selector?: string): Selection$1<DescElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new selection with the (first) child of each element of the current selection matching the selector.
	 *
	 * The first generic represents the type of the descendant element to be selected.
	 * The second generic represents the type of any of the child elements.
	 *
	 * @param selector A selector function, which is evaluated for each of the children nodes, in order, being passed the child (child), the child’s index (i), and the list of children (children);
	 * the method selects the first child for which the selector return truthy, if any.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChild<ResultElement extends BaseType, ChildElement extends BaseType>(selector: (child: ChildElement, i: number, children: ChildElement[]) => boolean): Selection$1<ResultElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new selection with the children of each element of the current selection matching the selector.
	 * Selects the children that match (if any)
	 *
	 * The first generic represents the type of the descendant element to be selected.
	 * The second generic refers to the type of the datum of the element to be selected.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChildren<DescElement extends BaseType, OldDatum>(selector?: string): Selection$1<DescElement, OldDatum, GElement, Datum>;
	/**
	 * Returns a new selection with the children of each element of the current selection matching the selector.
	 *
	 * The first generic represents the type of the descendant element to be selected.
	 * The second generic refers to the type of the datum of the element to be selected.
	 * The third generic represents the type of any of the child elements.
	 *
	 * @param selector A selector function, which is evaluated for each of the children nodes, in order, being passed the child (child), the child’s index (i), and the list of children (children);
	 * the method selects the first child for which the selector return truthy, if any.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChildren<ResultElement extends BaseType, ResultDatum, ChildElement extends BaseType>(selector: (child: ChildElement, i: number, children: ChildElement[]) => boolean): Selection$1<ResultElement, ResultDatum, GElement, Datum>;
	/**
	 * Returns the selection (for symmetry with transition.selection).
	 */
	selection(): this;
	// Modifying -------------------------------
	/**
	 * Return the current value of the specified attribute for the first (non-null) element in the selection.
	 * This is generally useful only if you know that the selection contains exactly one element.
	 *
	 * @param name Name of the attribute
	 */
	attr(name: string): string;
	/**
	 * Sets the attribute with the specified name to the specified value on the selected elements and returns this selection.
	 * If the value is a constant, all elements are given the same attribute value;
	 * otherwise, if the value is a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * The function’s return value is then used to set each element’s attribute.
	 * A null value will remove the specified attribute.
	 */
	attr(name: string, value: null | string | number | boolean | ReadonlyArray<string | number> | ValueFn<GElement, Datum, null | string | number | boolean | ReadonlyArray<string | number>>): this;
	/**
	 * Returns true if and only if the first (non-null) selected element has the specified classes.
	 * This is generally useful only if you know the selection contains exactly one element.
	 *
	 * @param names A string of space-separated class names.
	 */
	classed(names: string): boolean;
	/**
	 * Assigns or unassigns the specified CSS class names on the selected elements by setting
	 * the class attribute or modifying the classList property and returns this selection.
	 * If the constant value is truthy, then all elements are assigned the specified classes; otherwise, the classes are unassigned.
	 *
	 * @param names A string of space-separated class names.
	 * @param value A boolean flag (true = assign / false = unassign)
	 */
	classed(names: string, value: boolean): this;
	/**
	 * Assigns or unassigns the specified CSS class names on the selected elements by setting
	 * the class attribute or modifying the classList property and returns this selection.
	 * The assign/unassign status for the individual selected elements is determined by the boolean return
	 * value of the value function.
	 *
	 * @param names A string of space-separated class names.
	 * @param value A value function which is evaluated for each selected element, in order,
	 * being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * The function’s return value is then used to assign or unassign classes on each element.
	 */
	classed(names: string, value: ValueFn<GElement, Datum, boolean>): this;
	/**
	 * Returns the current value of the specified style property for the first (non-null) element in the selection.
	 * The current value is defined as the element’s inline value, if present, and otherwise its computed value.
	 * Accessing the current style value is generally useful only if you know the selection contains exactly one element.
	 *
	 * @param name Name of the style
	 */
	style(name: string): string;
	/**
	 * Clear the style with the specified name for the selected elements and returns this selection.
	 *
	 * @param name Name of the style
	 * @param value null,to clear the style
	 */
	style(name: string, value: null): this;
	/**
	 * Sets the value of the style with the specified name for the selected elements and returns this selection.
	 * All elements are given the same style value.
	 *
	 * @param name Name of the style
	 * @param value Constant value for the style
	 * @param priority An optional priority flag, either null or the string important (without the exclamation point)
	 */
	style(name: string, value: string | number | boolean, priority?: null | "important"): this;
	/**
	 * Sets the value of the style with the specified name for the selected elements and returns this selection.
	 * The value for the individual selected elements is determined by the value function.
	 *
	 * @param name Name of the style
	 * @param value A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).  A null value will clear the style.
	 * @param priority An optional priority flag, either null or the string important (without the exclamation point)
	 */
	style(name: string, value: ValueFn<GElement, Datum, string | number | boolean | null>, priority?: null | "important"): this;
	/**
	 * Return the current value of the specified property for the first (non-null) element in the selection.
	 * This is generally useful only if you know that the selection contains exactly one element.
	 *
	 * @param name Name of the property
	 */
	property(name: string): any;
	/**
	 * Look up a local variable on the first node of this selection. Note that this is not equivalent to `local.get(selection.node())` in that it will not look up locals set on the parent node(s).
	 *
	 * @param name The `d3.local` variable to look up.
	 */
	property<T>(name: Local<T>): T | undefined;
	/**
	 * Sets the property with the specified name to the specified value on selected elements.
	 * If the value is a constant, then all elements are given the same property value;
	 * otherwise, if the value is a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * The function’s return value is then used to set each element’s property. A null value will delete the specified property.
	 */
	property(name: string, value: ValueFn<GElement, Datum, any> | null): this;
	/**
	 * Sets the value of the property with the specified name for the selected elements and returns this selection.
	 * All elements are given the same property value.
	 *
	 * @param name Name of the property
	 * @param value Constant value for the property
	 */
	property(name: string, value: any): this;
	/**
	 * Store a value in a `d3.local` variable.
	 * This is equivalent to `selection.each(function (d, i, g) { name.set(this, value.call(this, d, i, g)); })` but more concise.
	 *
	 * @param name A `d3.local` variable
	 * @param value A callback that returns the value to store
	 */
	property<T>(name: Local<T>, value: ValueFn<GElement, Datum, T>): this;
	/**
	 * Store a value in a `d3.local` variable for each node in the selection.
	 * This is equivalent to `selection.each(function () { name.set(this, value); })` but more concise.
	 *
	 * @param name A `d3.local` variable
	 * @param value A callback that returns the value to store
	 */
	property<T>(name: Local<T>, value: T): this;
	/**
	 * Returns the text content for the first (non-null) element in the selection.
	 * This is generally useful only if you know the selection contains exactly one element.
	 */
	text(): string;
	/**
	 * Sets the text content to the specified value on all selected elements, replacing any existing child elements.
	 * If the value is a constant, then all elements are given the same text content;
	 * otherwise, if the value is a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * The function’s return value is then used to set each element’s text content.
	 * A null value will clear the content.
	 */
	text(value: null | string | number | boolean | ValueFn<GElement, Datum, string | number | boolean | null>): this;
	/**
	 * Returns a string representation of the inner HTML for the first (non-null) element in the selection.
	 * This is generally useful only if you know the selection contains exactly one element.
	 */
	html(): string;
	/**
	 * Sets the inner HTML to the specified value on all selected elements, replacing any existing child elements.
	 * If the value is a constant, then all elements are given the same inner HTML;
	 * otherwise, if the value is a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * The function’s return value is then used to set each element’s inner HTML.
	 * A null value will clear the content.
	 */
	html(value: null | string | ValueFn<GElement, Datum, string | null>): this;
	/**
	 * Appends a new element of this type (tag name) as the last child of each selected element,
	 * or before the next following sibling in the update selection if this is an enter selection.
	 * The latter behavior for enter selections allows you to insert elements into the DOM in an order consistent with the new bound data;
	 * however, note that selection.order may still be required if updating elements change order
	 * (i.e., if the order of new data is inconsistent with old data).
	 *
	 * This method returns a new selection containing the appended elements.
	 * Each new element inherits the data of the current elements, if any.
	 *
	 * @param type A string representing the tag name.
	 */
	append<K extends keyof ElementTagNameMap>(type: K): Selection$1<ElementTagNameMap[K], Datum, PElement, PDatum>;
	/**
	 * Appends a new element of this type (tag name) as the last child of each selected element,
	 * or before the next following sibling in the update selection if this is an enter selection.
	 * The latter behavior for enter selections allows you to insert elements into the DOM in an order consistent with the new bound data;
	 * however, note that selection.order may still be required if updating elements change order
	 * (i.e., if the order of new data is inconsistent with old data).
	 *
	 * This method returns a new selection containing the appended elements.
	 * Each new element inherits the data of the current elements, if any.
	 *
	 * The generic refers to the type of the child element to be appended.
	 *
	 * @param type A string representing the tag name. The specified name may have a namespace prefix, such as svg:text
	 * to specify a text attribute in the SVG namespace. If no namespace is specified, the namespace will be inherited
	 * from the parent element; or, if the name is one of the known prefixes, the corresponding namespace will be used
	 * (for example, svg implies svg:svg)
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	append<ChildElement extends BaseType>(type: string): Selection$1<ChildElement, Datum, PElement, PDatum>;
	/**
	 * Appends a new element of the type provided by the element creator function as the last child of each selected element,
	 * or before the next following sibling in the update selection if this is an enter selection.
	 * The latter behavior for enter selections allows you to insert elements into the DOM in an order consistent with the new bound data;
	 * however, note that selection.order may still be required if updating elements change order
	 * (i.e., if the order of new data is inconsistent with old data).
	 *
	 * This method returns a new selection containing the appended elements.
	 * Each new element inherits the data of the current elements, if any.
	 *
	 * The generic refers to the type of the child element to be appended.
	 *
	 * @param type A creator function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return
	 * an element to be appended. (The function typically creates a new element, but it may instead return an existing element.)
	 */
	append<ChildElement extends BaseType>(type: ValueFn<GElement, Datum, ChildElement>): Selection$1<ChildElement, Datum, PElement, PDatum>;
	/**
	 * Inserts a new element of the specified type (tag name) before the first element matching the specified
	 * before selector for each selected element. For example, a before selector :first-child will prepend nodes before the first child.
	 * If before is not specified, it defaults to null. (To append elements in an order consistent with bound data, use selection.append.)
	 *
	 * This method returns a new selection containing the appended elements.
	 * Each new element inherits the data of the current elements, if any.
	 *
	 * The generic refers to the type of the child element to be appended.
	 *
	 * @param type A string representing the tag name for the element type to be inserted.
	 * @param before One of:
	 *   * A CSS selector string for the element before which the insertion should occur.
	 *   * A child selector function which is evaluated for each selected element, in order, being passed the current datum (d),
	 *     the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return the child element
	 *     before which the element should be inserted.
	 */
	insert<K extends keyof ElementTagNameMap>(type: K, before?: string | ValueFn<GElement, Datum, BaseType>): Selection$1<ElementTagNameMap[K], Datum, PElement, PDatum>;
	/**
	 * Inserts a new element of the specified type (tag name) before the first element matching the specified
	 * before selector for each selected element. For example, a before selector :first-child will prepend nodes before the first child.
	 * If before is not specified, it defaults to null. (To append elements in an order consistent with bound data, use selection.append.)
	 *
	 * This method returns a new selection containing the appended elements.
	 * Each new element inherits the data of the current elements, if any.
	 *
	 * The generic refers to the type of the child element to be appended.
	 *
	 * @param type One of:
	 *   * A string representing the tag name for the element type to be inserted. The specified name may have a namespace prefix,
	 *     such as svg:text to specify a text attribute in the SVG namespace. If no namespace is specified, the namespace will be inherited
	 *     from the parent element; or, if the name is one of the known prefixes, the corresponding namespace will be used
	 *     (for example, svg implies svg:svg)
	 *   * A creator function which is evaluated for each selected element, in order, being passed the current datum (d),
	 *     the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return
	 *     an element to be inserted. (The function typically creates a new element, but it may instead return an existing element.)
	 * @param before One of:
	 *   * A CSS selector string for the element before which the insertion should occur.
	 *   * A child selector function which is evaluated for each selected element, in order, being passed the current datum (d),
	 *     the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). This function should return the child element
	 *     before which the element should be inserted.
	 */
	insert<ChildElement extends BaseType>(type: string | ValueFn<GElement, Datum, ChildElement>, before?: string | ValueFn<GElement, Datum, BaseType>): Selection$1<ChildElement, Datum, PElement, PDatum>;
	/**
	 * Removes the selected elements from the document.
	 * Returns this selection (the removed elements) which are now detached from the DOM.
	 */
	remove(): this;
	/**
	 * Inserts clones of the selected elements immediately following the selected elements and returns a selection of the newly
	 * added clones. If deep is true, the descendant nodes of the selected elements will be cloned as well. Otherwise, only the elements
	 * themselves will be cloned.
	 *
	 * @param deep Perform deep cloning if this flag is set to true.
	 */
	clone(deep?: boolean): Selection$1<GElement, Datum, PElement, PDatum>;
	/**
	 * Return a new selection that contains a copy of each group in this selection sorted according
	 * to the compare function. After sorting, re-inserts elements to match the resulting order (per selection.order).
	 *
	 * Note that sorting is not guaranteed to be stable; however, it is guaranteed to have the same
	 * behavior as your browser’s built-in sort method on arrays.
	 *
	 * @param comparator An optional comparator function, which defaults to "ascending". The function is passed
	 * two elements’ data a and b to compare. It should return either a negative, positive, or zero value.
	 * If negative, then a should be before b; if positive, then a should be after b; otherwise, a and b are
	 * considered equal and the order is arbitrary.
	 */
	sort(comparator?: (a: Datum, b: Datum) => number): this;
	/**
	 * Re-insert elements into the document such that the document order of each group matches the selection order.
	 * This is equivalent to calling selection.sort if the data is already sorted, but much faster.
	 */
	order(): this;
	/**
	 * Re-insert each selected element, in order, as the last child of its parent.
	 */
	raise(): this;
	/**
	 * Re-insert each selected element, in order, as the first child of its parent.
	 */
	lower(): this;
	// Data Join ---------------------------------
	/**
	 * Returns the array of data for the selected elements.
	 */
	data(): Datum[];
	/**
	 * Joins the specified array of data with the selected elements, returning a new selection that represents
	 * the update selection: the elements successfully bound to data. Also defines the enter and exit selections on
	 * the returned selection, which can be used to add or remove elements to correspond to the new data.
	 *
	 * The data is specified for each group in the selection. If the selection has multiple groups
	 * (such as d3.selectAll followed by selection.selectAll), then data should typically be specified as a function.
	 *
	 * If a key function is not specified, then the first datum in data is assigned to the first selected element,
	 * the second datum to the second selected element, and so on.
	 * A key function may be specified to control which datum is assigned to which element, replacing the default join-by-index,
	 * by computing a string identifier for each datum and element.
	 *
	 * The update and enter selections are returned in data order, while the exit selection preserves the selection
	 * order prior to the join. If a key function is specified, the order of elements in the selection may not match
	 * their order in the document; use selection.order or selection.sort as needed.
	 *
	 * This method cannot be used to clear bound data; use selection.datum instead.
	 *
	 * For details see: {@link https://github.com/d3/d3-selection#joining-data }
	 *
	 * The generic refers to the type of the new datum to be used for the selected elements.
	 *
	 * @param data The specified data is an array or iterable of arbitrary values (e.g., numbers or objects)
	 * or a value function which will be evaluated for each group in order, being passed the group’s parent datum
	 * (d, which may be undefined), the group index (i), and the selection’s parent nodes (nodes),
	 * with this as the group’s parent element. The function returns an array or iterable of values for each group.
	 * @param key An optional key function which is evaluated for each selected element, in order, being passed the
	 * current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]); the returned string is the element’s key.
	 * The key function is then also evaluated for each new datum in data, being passed the current datum (d),
	 * the current index (i), and the group’s new data, with this as the group’s parent DOM element (nodes[i]); the returned string is the datum’s key.
	 * The datum for a given key is assigned to the element with the matching key. If multiple elements have the same key,
	 * the duplicate elements are put into the exit selection; if multiple data have the same key, the duplicate data are put into the enter selection.
	 */
	data<NewDatum>(data: NewDatum[] | Iterable<NewDatum> | ValueFn<PElement, PDatum, NewDatum[] | Iterable<NewDatum>>, key?: ValueFn<GElement | PElement, Datum | NewDatum, KeyType$1>): Selection$1<GElement, NewDatum, PElement, PDatum>;
	/**
	 * Appends, removes and reorders elements as necessary to match the data that was previously bound by `selection.data`, returning the merged enter and update selection.
	 * This method is a convenient alternative to the more explicit `selection.enter`, `selection.exit`, `selection.append` and `selection.remove`.
	 *
	 * The "matching" logic is determined by the key function passed to `selection.data`.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	join<K extends keyof ElementTagNameMap, OldDatum = Datum>(enter: K, update?: (elem: Selection$1<GElement, Datum, PElement, PDatum>) => Selection$1<GElement, Datum, PElement, PDatum> | TransitionLike<GElement, Datum> | undefined, exit?: (elem: Selection$1<GElement, OldDatum, PElement, PDatum>) => void): Selection$1<GElement | ElementTagNameMap[K], Datum, PElement, PDatum>;
	/**
	 * Appends, removes and reorders elements as necessary to match the data that was previously bound by `selection.data`, returning the merged enter and update selection.
	 * This method is a convenient alternative to the more explicit `selection.enter`, `selection.exit`, `selection.append` and `selection.remove`.
	 *
	 * The "matching" logic is determined by the key function passed to `selection.data`.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	join<ChildElement extends BaseType, OldDatum = Datum>(enter: string | ((elem: Selection$1<EnterElement, Datum, PElement, PDatum>) => Selection$1<ChildElement, Datum, PElement, PDatum> | TransitionLike<GElement, Datum>), update?: (elem: Selection$1<GElement, Datum, PElement, PDatum>) => Selection$1<GElement, Datum, PElement, PDatum> | TransitionLike<GElement, Datum> | undefined, exit?: (elem: Selection$1<GElement, OldDatum, PElement, PDatum>) => void): Selection$1<ChildElement | GElement, Datum, PElement, PDatum>;
	/**
	 * Return the enter selection: placeholder nodes for each datum that had no corresponding DOM element
	 * in the selection. (The enter selection is empty for selections not returned by selection.data.)
	 */
	enter(): Selection$1<EnterElement, Datum, PElement, PDatum>;
	/**
	 * Returns the exit selection: existing DOM elements in the selection for which no new datum was found.
	 * (The exit selection is empty for selections not returned by selection.data.)
	 *
	 * IMPORTANT: The generic refers to the type of the old datum associated with the exit selection elements.
	 * Ensure you set the generic to the correct type, if you need to access the data on the exit selection in
	 * follow-up steps, e.g. to set styles as part of an exit transition before removing them.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	exit<OldDatum>(): Selection$1<GElement, OldDatum, PElement, PDatum>;
	/**
	 * Returns the bound datum for the first (non-null) element in the selection.
	 * This is generally useful only if you know the selection contains exactly one element.
	 */
	datum(): Datum;
	/**
	 * Delete the bound data for each element in the selection.
	 */
	datum(value: null): Selection$1<GElement, undefined, PElement, PDatum>;
	/**
	 * Sets the element’s bound data using the specified value function on all selected elements.
	 * Unlike selection.data, this method does not compute a join and does not affect
	 * indexes or the enter and exit selections.
	 *
	 * The generic refers to the type of the new datum to be used for the selected elements.
	 *
	 * @param value A value function which is evaluated for each selected element, in order,
	 * being passed the current datum (d), the current index (i), and the current group (nodes),
	 * with this as the current DOM element (nodes[i]). The function is then used to set each element’s new data.
	 * A null value will delete the bound data.
	 */
	datum<NewDatum>(value: ValueFn<GElement, Datum, NewDatum>): Selection$1<GElement, NewDatum, PElement, PDatum>;
	/**
	 * Sets the element’s bound data to the specified value on all selected elements.
	 * Unlike selection.data, this method does not compute a join and does not affect
	 * indexes or the enter and exit selections.
	 *
	 * The generic refers to the type of the new datum to be used for the selected elements.
	 *
	 * @param value A value object to be used as the datum for each element.
	 */
	datum<NewDatum>(value: NewDatum): Selection$1<GElement, NewDatum, PElement, PDatum>;
	// Event Handling -------------------
	/**
	 * Return the currently-assigned listener for the specified event typename on the first (non-null) selected element,
	 * if any, If multiple typenames are specified, the first matching listener is returned.
	 *
	 * @param typenames The typenames is a string event type, such as click, mouseover, or submit; any DOM event type supported by your browser may be used.
	 * The type may be optionally followed by a period (.) and a name; the optional name allows multiple callbacks to be registered
	 * to receive events of the same type, such as click.foo and click.bar. To specify multiple typenames, separate typenames with spaces,
	 * such as "input change"" or "click.foo click.bar".
	 */
	on<Source extends string>(typenames: Source): ((this: GElement, event: Selection$1.EventOf<Source, GElement>, d: Datum) => void) | undefined;
	/**
	 * Remove a listener for the specified event type names. To remove all listeners for a given name,
	 * pass null as the listener and ".foo" as the typename, where foo is the name; to remove all listeners with no name, specify "." as the typename.
	 *
	 * @param typenames The typenames is a string event type, such as click, mouseover, or submit; any DOM event type supported by your browser may be used.
	 * The type may be optionally followed by a period (.) and a name; the optional name allows multiple callbacks to be registered
	 * to receive events of the same type, such as click.foo and click.bar. To specify multiple typenames, separate typenames with spaces,
	 * such as "input change"" or "click.foo click.bar".
	 * @param listener null to indicate removal of listener
	 */
	on(typenames: string, listener: null): this;
	/**
	 * Add an event listener for the specified event type names. If an event listener was previously registered for the same typename
	 * on a selected element, the old listener is removed before the new listener is added.
	 *
	 * When a specified event is dispatched on a selected node, the specified listener will be evaluated for each selected element.
	 *
	 * @param typenames The typenames is a string event type, such as click, mouseover, or submit; any DOM event type supported by your browser may be used.
	 * The type may be optionally followed by a period (.) and a name; the optional name allows multiple callbacks to be registered
	 * to receive events of the same type, such as click.foo and click.bar. To specify multiple typenames, separate typenames with spaces,
	 * such as "input change"" or "click.foo click.bar".
	 * @param listener A listener function which will be evaluated for each selected element,
	 * being passed the current event (event) and the current datum (d), with this as the current DOM element (event.currentTarget).
	 * Listeners always see the latest datum for their element.
	 * Note: while you can use event.pageX and event.pageY directly,
	 * it is often convenient to transform the event position to the local coordinate system of that element that received the event using d3.pointer.
	 * @param options An optional options object may specify characteristics about the event listener, such as wehether it is captures or passive; see {@link AddEventListenerOptions}.
	 */
	on<Source extends string>(typenames: Source, listener: (this: GElement, event: Selection$1.EventOf<Source, GElement>, d: Datum) => void, options?: boolean | AddEventListenerOptions): this;
	/**
	 * Dispatches a custom event of the specified type to each selected element, in order.
	 * An optional parameters map may be specified to set additional properties of the event.
	 *
	 * @param type Name of event to dispatch
	 * @param parameters An optional value map with custom event parameters
	 */
	dispatch(type: string, parameters?: CustomEventParameters): this;
	/**
	 * Dispatches a custom event of the specified type to each selected element, in order.
	 * An optional value function returning a parameters map for each element in the selection may be specified to set additional properties of the event.
	 *
	 * @param type Name of event to dispatch
	 * @param parameters A value function which is evaluated for each selected element, in order,
	 * being passed the current datum (d), the current index (i), and the current group (nodes),
	 * with this as the current DOM element (nodes[i]). It must return the parameters map for the current element.
	 */
	dispatch(type: string, parameters?: ValueFn<GElement, Datum, CustomEventParameters>): this;
	// Control Flow ----------------------
	/**
	 * Invoke the specified function for each selected element, passing in the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * This method can be used to invoke arbitrary code for each selected element, and is useful for creating a context to access parent and child data simultaneously.
	 *
	 * @param func A function which is invoked for each selected element,
	 *             being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 */
	each(func: ValueFn<GElement, Datum, void>): this;
	/**
	 * Invoke the specified function exactly once, passing in this selection along with any optional arguments.
	 * Returns this selection.
	 *
	 * @param func A function which is passed this selection as the first argument along with any optional arguments.
	 * @param args List of optional arguments to be passed to the callback function.
	 */
	call<Args extends any[]>(func: (selection: Selection$1<GElement, Datum, PElement, PDatum>, ...args: Args) => void, ...args: Args): this;
	/**
	 * Return true if this selection contains no (non-null) elements.
	 */
	empty(): boolean;
	/**
	 * Return an array of all (non-null) elements in this selection.
	 */
	nodes(): GElement[];
	/**
	 * Return the first (non-null) element in this selection. If the selection is empty, returns null.
	 */
	node(): GElement | null;
	/**
	 * Returns the total number of elements in this selection.
	 */
	size(): number;
	/**
	 * Returns an iterator over the selected (non-null) elements.
	 */
	[Symbol.iterator](): Iterator<GElement>;
}
interface Local<T> {
	/**
	 * Retrieves a local variable stored on the node (or one of its parents).
	 *
	 * @param node A node element.
	 */
	get(node: Element): T | undefined;
	/**
	 * Deletes the value associated with the given node. Values stored on ancestors are not affected, meaning that child nodes will still see inherited values.
	 *
	 * This function returns true if there was a value stored directly on the node, and false otherwise.
	 *
	 * @param node A node element.
	 */
	remove(node: Element): boolean;
	/**
	 * Store a value for this local variable. Calling `.get()` on children of this node will also retrieve the variable's value.
	 *
	 * @param node A node element.
	 * @param value Value to store locally
	 */
	set(node: Element, value: T): T;
	/**
	 * Obtain a string with the internally assigned property name for the local
	 * which is used to store the value on a node
	 */
	toString(): string;
}
type DraggedElementBaseType = Element;
type DragContainerElement = HTMLElement | SVGSVGElement | SVGGElement;
interface SubjectPosition {
	/**
	 * x-coordinate
	 */
	x: number;
	/**
	 * y-coordinate
	 */
	y: number;
}
interface DragBehavior<GElement extends DraggedElementBaseType, Datum, Subject> extends Function {
	/**
	 * Applies the drag behavior to the selected elements.
	 * This function is typically not invoked directly, and is instead invoked via selection.call.
	 *
	 * For details see: {@link https://github.com/d3/d3-drag#_drag}
	 *
	 * @param selection A D3 selection of elements.
	 * @param args Optional arguments to be passed in.
	 */
	(selection: Selection$1<GElement, Datum, any, any>, ...args: any[]): void;
	/**
	 * Returns the current container accessor function.
	 */
	container(): ValueFn<GElement, Datum, DragContainerElement>;
	/**
	 * Sets the container accessor to the specified function and returns the drag behavior.
	 *
	 * The container of a drag gesture determines the coordinate system of subsequent drag events, affecting event.x and event.y.
	 * The element returned by the container accessor is subsequently passed to d3.pointer to determine the local coordinates of the pointer.
	 *
	 * The default container accessor returns the parent node of the element in the originating selection (see drag)
	 * that received the initiating input event. This is often appropriate when dragging SVG or HTML elements,
	 * since those elements are typically positioned relative to a parent. For dragging graphical elements with a Canvas,
	 * however, you may want to redefine the container as the initiating element itself, using "this" in the accessor
	 * function.
	 *
	 * @param accessor A container accessor function which is evaluated for each selected element,
	 * in order, being passed the current datum (d), the current index (i), and the current group (nodes),
	 * with this as the current DOM element. The function returns the container element.
	 */
	container(accessor: ValueFn<GElement, Datum, DragContainerElement>): this;
	/**
	 * Sets the container accessor to the specified object and returns the drag behavior.
	 *
	 * The container of a drag gesture determines the coordinate system of subsequent drag events, affecting event.x and event.y.
	 * The element returned by the container accessor is subsequently passed to d3.pointer to determine the local coordinates of the pointer.
	 *
	 * The default container accessor returns the parent node of the element in the originating selection (see drag)
	 * that received the initiating input event. This is often appropriate when dragging SVG or HTML elements,
	 * since those elements are typically positioned relative to a parent. For dragging graphical elements with a Canvas,
	 * however, you may want to redefine the container as the initiating element itself, such as drag.container(canvas).
	 *
	 * @param container Container element for the drag gesture.
	 */
	container(container: DragContainerElement): this;
	/**
	 * Returns the current filter function.
	 */
	filter(): (this: GElement, event: any, d: Datum) => boolean;
	/**
	 * Sets the event filter to the specified filter function and returns the drag behavior.
	 *
	 * If the filter returns falsey, the initiating event is ignored and no drag gesture is started.
	 * Thus, the filter determines which input events are ignored. The default filter ignores mousedown events on secondary buttons,
	 * since those buttons are typically intended for other purposes, such as the context menu.
	 *
	 * @param filterFn A filter function which is evaluated for each selected element,
	 * in order, being passed the current event (event) and datum d, with the this context as the current DOM element.
	 * The function returns a boolean value.
	 */
	filter(filterFn: (this: GElement, event: any, d: Datum) => boolean): this;
	/**
	 * Returns the current touch support detector, which defaults to a function returning true,
	 * if the "ontouchstart" event is supported on the current element.
	 */
	touchable(): ValueFn<GElement, Datum, boolean>;
	/**
	 * Sets the touch support detector to the specified boolean value and returns the drag behavior.
	 *
	 * Touch event listeners are only registered if the detector returns truthy for the corresponding element when the drag behavior is applied.
	 * The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
	 * fails detection.
	 *
	 * @param touchable A boolean value. true when touch event listeners should be applied to the corresponding element, otherwise false.
	 */
	touchable(touchable: boolean): this;
	/**
	 * Sets the touch support detector to the specified function and returns the drag behavior.
	 *
	 * Touch event listeners are only registered if the detector returns truthy for the corresponding element when the drag behavior is applied.
	 * The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
	 * fails detection.
	 *
	 * @param touchable A touch support detector function, which returns true when touch event listeners should be applied to the corresponding element.
	 * The function is evaluated for each selected element to which the drag behavior was applied, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element. The function returns a boolean value.
	 */
	touchable(touchable: ValueFn<GElement, Datum, boolean>): this;
	/**
	 *  Returns the current subject accessor functions.
	 */
	subject(): (this: GElement, event: any, d: Datum) => Subject;
	/**
	 * Sets the subject accessor to the specified function and returns the drag behavior.
	 *
	 * The subject of a drag gesture represents the thing being dragged.
	 * It is computed when an initiating input event is received,
	 * such as a mousedown or touchstart, immediately before the drag gesture starts.
	 * The subject is then exposed as event.subject on subsequent drag events for this gesture.
	 *
	 * The default subject is the datum of the element in the originating selection (see drag)
	 * that received the initiating input event; if this datum is undefined,
	 * an object representing the coordinates of the pointer is created.
	 * When dragging circle elements in SVG, the default subject is thus the datum of the circle being dragged.
	 * With Canvas, the default subject is the canvas element’s datum (regardless of where on the canvas you click).
	 * In this case, a custom subject accessor would be more appropriate,
	 * such as one that picks the closest circle to the mouse within a given search radius.
	 *
	 * The subject of a drag gesture may not be changed after the gesture starts.
	 *
	 * During the evaluation of the subject accessor, event is a beforestart drag event.
	 * Use event.sourceEvent to access the initiating input event and event.identifier to access the touch identifier.
	 * The event.x and event.y are relative to the container, and are computed using d3.pointer.
	 *
	 * @param accessor An extent accessor function which is evaluated for each selected element,
	 * in order, being passed the current event (`event`) and datum `d`, with the `this` context as the current DOM element.
	 * The returned subject should be an object that exposes x and y properties,
	 * so that the relative position of the subject and the pointer can be preserved during the drag gesture.
	 * If the subject is null or undefined, no drag gesture is started for this pointer;
	 * however, other starting touches may yet start drag gestures.
	 */
	subject(accessor: (this: GElement, event: any, d: Datum) => Subject): this;
	/**
	 * Return the current click distance threshold, which defaults to zero.
	 */
	clickDistance(): number;
	/**
	 * Set the maximum distance that the mouse can move between mousedown and mouseup that will trigger
	 * a subsequent click event. If at any point between mousedown and mouseup the mouse is greater than or equal to
	 * distance from its position on mousedown, the click event following mouseup will be suppressed.
	 *
	 * @param distance The distance threshold between mousedown and mouseup measured in client coordinates (event.clientX and event.clientY).
	 * The default is zero.
	 */
	clickDistance(distance: number): this;
	/**
	 * Return the first currently-assigned listener matching the specified typenames, if any.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 */
	on(typenames: string): ((this: GElement, event: any, d: Datum) => void) | undefined;
	/**
	 * Remove the current event listeners for the specified typenames, if any, return the drag behavior.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 * @param listener Use null to remove the listener.
	 */
	on(typenames: string, listener: null): this;
	/**
	 * Set the event listener for the specified typenames and return the drag behavior.
	 * If an event listener was already registered for the same type and name,
	 * the existing listener is removed before the new listener is added.
	 * When a specified event is dispatched, each listener will be invoked with the same context and arguments as selection.on listeners.
	 *
	 * Changes to registered listeners via drag.on during a drag gesture do not affect the current drag gesture.
	 * Instead, you must use event.on, which also allows you to register temporary event listeners for the current drag gesture.
	 * Separate events are dispatched for each active pointer during a drag gesture.
	 * For example, if simultaneously dragging multiple subjects with multiple fingers, a start event is dispatched for each finger,
	 * even if both fingers start touching simultaneously.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 * @param listener An event listener function which is evaluated for each selected element,
	 * in order, being passed the current event (event) and datum d, with the this context as the current DOM element.
	 */
	on(typenames: string, listener: (this: GElement, event: any, d: Datum) => void): this;
}
interface D3DragEvent<GElement extends DraggedElementBaseType, Datum, Subject> {
	/**
	 * The DragBehavior associated with the event
	 */
	target: DragBehavior<GElement, Datum, Subject>;
	/**
	 * The event type for the DragEvent
	 */
	type: "start" | "drag" | "end" | string; // Leave failsafe string type for cases like 'drag.foo'
	/**
	 * The drag subject, defined by drag.subject.
	 */
	subject: Subject;
	/**
	 * The new x-coordinate of the subject, relative to the container
	 */
	x: number;
	/**
	 * The new y-coordinate of the subject, relative to the container
	 */
	y: number;
	/**
	 * The change in x-coordinate since the previous drag event.
	 */
	dx: number;
	/**
	 * The change in y-coordinate since the previous drag event.
	 */
	dy: number;
	/**
	 * The string “mouse”, or a numeric touch identifier.
	 */
	identifier: "mouse" | number;
	/**
	 * The number of currently active drag gestures (on start and end, not including this one).
	 *
	 * The event.active field is useful for detecting the first start event and the last end event
	 * in a sequence of concurrent drag gestures: it is zero when the first drag gesture starts,
	 * and zero when the last drag gesture ends.
	 */
	active: number;
	/**
	 * The underlying input event, such as mousemove or touchmove.
	 */
	sourceEvent: any;
	/**
	 * Return the first currently-assigned listener matching the specified typenames, if any.
	 *
	 * Equivalent to drag.on, but only applies to the current drag gesture. Before the drag gesture starts,
	 * a copy of the current drag event listeners is made. This copy is bound to the current drag gesture
	 * and modified by event.on. This is useful for temporary listeners that only receive events for the current drag gesture.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 */
	on(typenames: string): ((this: GElement, event: any, d: Datum) => void) | undefined;
	/**
	 * Remove the current event listeners for the specified typenames, if any, return the drag behavior.
	 *
	 * Equivalent to drag.on, but only applies to the current drag gesture. Before the drag gesture starts,
	 * a copy of the current drag event listeners is made. This copy is bound to the current drag gesture
	 * and modified by event.on. This is useful for temporary listeners that only receive events for the current drag gesture.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 * @param listener Use null to remove the listener.
	 */
	on(typenames: string, listener: null): this;
	/**
	 * Set the event listener for the specified typenames and return the drag behavior.
	 * If an event listener was already registered for the same type and name,
	 * the existing listener is removed before the new listener is added.
	 * When a specified event is dispatched, each listener will be invoked with the same context and arguments as selection.on listeners.
	 *
	 * Equivalent to drag.on, but only applies to the current drag gesture. Before the drag gesture starts,
	 * a copy of the current drag event listeners is made. This copy is bound to the current drag gesture
	 * and modified by event.on. This is useful for temporary listeners that only receive events for the current drag gesture.
	 *
	 * @param typenames The typenames is a string containing one or more typename separated by whitespace.
	 * Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar";
	 * the name allows multiple listeners to be registered for the same type. The type must be one of the following:
	 * start (after a new pointer becomes active [on mousedown or touchstart]), drag (after an active pointer moves [on mousemove or touchmove], or
	 * end (after an active pointer becomes inactive [on mouseup, touchend or touchcancel].)
	 * @param listener An event listener function which is evaluated for each selected element,
	 * in order, being passed the current event (event) and datum d, with the this context as the current DOM element.
	 */
	on(typenames: string, listener: (this: GElement, event: any, d: Datum) => void): this;
}
interface ZoomScale {
	domain(): number[] | Date[];
	domain(domain: Array<Date | number>): this;
	range(): number[];
	range(range: number[]): this;
	copy(): ZoomScale;
	invert(value: number): number | Date;
}
declare class ZoomTransform {
	/**
	 * Returns a transform with scale k and translation (x, y).
	 */
	constructor(k: number, x: number, y: number);
	/**
	 * The translation amount tx along the x-axis.
	 * This property should be considered read-only; instead of mutating a transform,
	 * use transform.scale and transform.translate to derive a new transform.
	 * Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior.
	 */
	readonly x: number;
	/**
	 * The translation amount ty along the y-axis
	 * This property should be considered read-only; instead of mutating a transform,
	 * use transform.scale and transform.translate to derive a new transform.
	 * Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior.
	 */
	readonly y: number;
	/**
	 * The scale factor k.
	 * This property should be considered read-only; instead of mutating a transform,
	 * use transform.scale and transform.translate to derive a new transform.
	 * Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior.
	 */
	readonly k: number;
	/**
	 * Return the transformation of the specified point which is a two-element array of numbers [x, y].
	 * The returned point is equal to [xk + tx, yk + ty].
	 *
	 * @param point Point coordinates [x, y]
	 */
	apply(point: [
		number,
		number
	]): [
		number,
		number
	];
	/**
	 * Return the transformation of the specified x-coordinate, xk + tx.
	 *
	 * @param x Value of x-coordinate.
	 */
	applyX(x: number): number;
	/**
	 * Return the transformation of the specified y-coordinate, yk + ty.
	 *
	 * @param y Value of y-coordinate.
	 */
	applyY(y: number): number;
	/**
	 * Return the inverse transformation of the specified point which is a two-element array of numbers [x, y].
	 * The returned point is equal to [(x - tx) / k, (y - ty) / k].
	 *
	 * @param point Point coordinates [x, y]
	 */
	invert(point: [
		number,
		number
	]): [
		number,
		number
	];
	/**
	 * Return the inverse transformation of the specified x-coordinate, (x - tx) / k.
	 *
	 * @param x Value of x-coordinate.
	 */
	invertX(x: number): number;
	/**
	 * Return the inverse transformation of the specified y-coordinate, (y - ty) / k.
	 *
	 * @param y Value of y-coordinate.
	 */
	invertY(y: number): number;
	/**
	 * Returns a copy of the continuous scale x whose domain is transformed.
	 * This is implemented by first applying the inverse x-transform on the scale’s range,
	 * and then applying the inverse scale to compute the corresponding domain
	 *
	 * The scale x must use d3.interpolateNumber; do not use continuous.rangeRound as this
	 * reduces the accuracy of continuous.invert and can lead to an inaccurate rescaled domain.
	 * This method does not modify the input scale x; x thus represents the untransformed scale,
	 * while the returned scale represents its transformed view.
	 *
	 * @param xScale A continuous scale for x-dimension.
	 */
	rescaleX<S extends ZoomScale>(xScale: S): S;
	/**
	 * Returns a copy of the continuous scale y whose domain is transformed.
	 * This is implemented by first applying the inverse y-transform on the scale’s range,
	 * and then applying the inverse scale to compute the corresponding domain
	 *
	 * The scale y must use d3.interpolateNumber; do not use continuous.rangeRound as this
	 * reduces the accuracy of continuous.invert and can lead to an inaccurate rescaled domain.
	 * This method does not modify the input scale x; x thus represents the untransformed scale,
	 * while the returned scale represents its transformed view.
	 *
	 * @param yScale A continuous scale for y-dimension.
	 */
	rescaleY<S extends ZoomScale>(yScale: S): S;
	/**
	 * Return a transform whose scale k1 is equal to k0 × k, where k0 is this transform’s scale.
	 *
	 * @param k A scale factor.
	 */
	scale(k: number): ZoomTransform;
	/**
	 * Return a string representing the SVG transform corresponding to this transform.
	 */
	toString(): string;
	/**
	 * Returns a transform whose translation tx1 and ty1 is equal to tx0 + tkx and ty0 + tky,
	 * where tx0 and ty0 is this transform’s translation and tk is this transform’s scale.
	 *
	 * @param x Amount of translation in x-direction.
	 * @param y Amount of translation in y-direction.
	 */
	translate(x: number, y: number): ZoomTransform;
}
/**
 * While [`PanelPosition`](/api-reference/types/panel-position) can be used to place a
 * component in the corners of a container, the `Position` enum is less precise and used
 * primarily in relation to edges and handles.
 *
 * @public
 */
export declare enum Position {
	Left = "left",
	Top = "top",
	Right = "right",
	Bottom = "bottom"
}
/**
 * All positions are stored in an object with x and y coordinates.
 *
 * @public
 */
export type XYPosition = {
	x: number;
	y: number;
};
export type XYZPosition = XYPosition & {
	z: number;
};
export type Dimensions = {
	width: number;
	height: number;
};
export type Rect = Dimensions & XYPosition;
export type Box = XYPosition & {
	x2: number;
	y2: number;
};
export type Transform = [
	number,
	number,
	number
];
/**
 * A coordinate extent represents two points in a coordinate system: one in the top
 * left corner and one in the bottom right corner. It is used to represent the
 * bounds of nodes in the flow or the bounds of the viewport.
 *
 * @public
 *
 * @remarks Props that expect a `CoordinateExtent` usually default to `[[-∞, -∞], [+∞, +∞]]`
 * to represent an unbounded extent.
 */
export type CoordinateExtent = [
	[
		number,
		number
	],
	[
		number,
		number
	]
];
type DistributivePick<T, K extends string> = T extends unknown ? {
	[P in Extract<keyof T, K>]: T[P];
} : never;
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type NodeBase<NodeData extends Record<string, unknown> = Record<string, unknown>, NodeType extends string | undefined = string | undefined> = {
	/** Unique id of a node. */
	id: string;
	/**
	 * Position of a node on the pane.
	 * @example { x: 0, y: 0 }
	 */
	position: XYPosition;
	/** Arbitrary data passed to a node. */
	data: NodeData;
	/**
	 * Only relevant for default, source, target nodeType. Controls source position.
	 * @example 'right', 'left', 'top', 'bottom'
	 */
	sourcePosition?: Position;
	/**
	 * Only relevant for default, source, target nodeType. Controls target position.
	 * @example 'right', 'left', 'top', 'bottom'
	 */
	targetPosition?: Position;
	/** Whether or not the node should be visible on the canvas. */
	hidden?: boolean;
	selected?: boolean;
	/** Whether or not the node is currently being dragged. */
	dragging?: boolean;
	/** Whether or not the node is able to be dragged. */
	draggable?: boolean;
	selectable?: boolean;
	connectable?: boolean;
	deletable?: boolean;
	/**
	 * A class name that can be applied to elements inside the node that allows those elements to act
	 * as drag handles, letting the user drag the node by clicking and dragging on those elements.
	 */
	dragHandle?: string;
	width?: number;
	height?: number;
	initialWidth?: number;
	initialHeight?: number;
	/** Parent node id, used for creating sub-flows. */
	parentId?: string;
	zIndex?: number;
	/**
	 * Boundary a node can be moved in.
	 * @example 'parent' or [[0, 0], [100, 100]]
	 */
	extent?: "parent" | CoordinateExtent | null;
	/**
	 * When `true`, the parent node will automatically expand if this node is dragged to the edge of
	 * the parent node's bounds.
	 */
	expandParent?: boolean;
	ariaLabel?: string;
	/**
	 * Origin of the node relative to its position.
	 * @example
	 * [0.5, 0.5] // centers the node
	 * [0, 0] // top left
	 * [1, 1] // bottom right
	 */
	origin?: NodeOrigin;
	handles?: NodeHandle[];
	measured?: {
		width?: number;
		height?: number;
	};
} & (undefined extends NodeType ? {
	/** Type of node defined in nodeTypes */
	type?: string | undefined;
} : {
	/** Type of node defined in nodeTypes */
	type: NodeType;
});
type InternalNodeBase<NodeType extends NodeBase = NodeBase> = Omit<NodeType, "measured"> & {
	measured: {
		width?: number;
		height?: number;
	};
	internals: {
		positionAbsolute: XYPosition;
		z: number;
		rootParentIndex?: number;
		/**
		 * Holds a reference to the original node object provided by the user.
		 * Used as an optimization to avoid certain operations.
		 */
		userNode: NodeType;
		handleBounds?: NodeHandleBounds;
		bounds?: NodeBounds;
	};
};
type NodeProps<NodeType extends NodeBase> = Pick<NodeType, "id" | "data" | "width" | "height" | "sourcePosition" | "targetPosition" | "dragHandle" | "parentId"> & Required<Pick<NodeType, "type" | "dragging" | "zIndex" | "selectable" | "deletable" | "selected" | "draggable">> & {
	/** Whether a node is connectable or not. */
	isConnectable: boolean;
	/** Position absolute x value. */
	positionAbsoluteX: number;
	/** Position absolute y value. */
	positionAbsoluteY: number;
};
type NodeHandleBounds = {
	source: Handle[] | null;
	target: Handle[] | null;
};
type InternalNodeUpdate = {
	id: string;
	nodeElement: HTMLDivElement;
	force?: boolean;
};
type NodeBounds = XYPosition & {
	width: number | null;
	height: number | null;
};
type NodeDragItem = {
	id: string;
	position: XYPosition;
	distance: XYPosition;
	measured: {
		width: number;
		height: number;
	};
	internals: {
		positionAbsolute: XYPosition;
	};
} & Pick<InternalNodeBase, "extent" | "parentId" | "origin" | "expandParent" | "dragging">;
/**
 * The origin of a Node determines how it is placed relative to its own coordinates.
 * `[0, 0]` places it at the top left corner, `[0.5, 0.5]` right in the center and
 * `[1, 1]` at the bottom right of its position.
 *
 * @public
 */
export type NodeOrigin = [
	number,
	number
];
export type OnSelectionDrag<NodeType extends NodeBase = NodeBase> = (event: MouseEvent, nodes: NodeType[]) => void;
/**
 * Type for the handles of a node
 *
 * @public
 */
export type NodeHandle = Omit<Optional<Handle, "width" | "height">, "nodeId">;
export type Align = "center" | "start" | "end";
type NodeLookup<NodeType extends InternalNodeBase = InternalNodeBase> = Map<string, NodeType>;
type ParentLookup<NodeType extends InternalNodeBase = InternalNodeBase> = Map<string, Map<string, NodeType>>;
/**
 * @inline
 */
export type HandleType = "source" | "target";
type Handle = {
	id?: string | null;
	nodeId: string;
	x: number;
	y: number;
	position: Position;
	type: HandleType;
	width: number;
	height: number;
};
type HandleProps = {
	/**
	 * Type of the handle.
	 * @default "source"
	 */
	type: HandleType;
	/**
	 * The position of the handle relative to the node. In a horizontal flow source handles are
	 * typically `Position.Right` and in a vertical flow they are typically `Position.Top`.
	 * @default Position.Top
	 * @example Position.Top, Position.Right, Position.Bottom, Position.Left
	 */
	position: Position;
	/**
	 * Should you be able to connect to/from this handle.
	 * @default true
	 */
	isConnectable?: boolean;
	/**
	 * Dictates whether a connection can start from this handle.
	 * @default true
	 */
	isConnectableStart?: boolean;
	/**
	 * Dictates whether a connection can end on this handle.
	 * @default true
	 */
	isConnectableEnd?: boolean;
	/**
	 * Called when a connection is dragged to this handle. You can use this callback to perform some
	 * custom validation logic based on the connection target and source, for example. Where possible,
	 * we recommend you move this logic to the `isValidConnection` prop on the main ReactFlow
	 * component for performance reasons.
	 * @remarks connection becomes an edge if isValidConnection returns true
	 */
	isValidConnection?: IsValidConnection;
	/**
	 * Id of the handle.
	 * @remarks optional if there is only one handle of this type
	 */
	id?: string | null;
};
type OnTransformChange = (transform: Transform) => void;
type PanZoomTransformOptions = {
	duration?: number;
	ease?: (t: number) => number;
	interpolate?: "smooth" | "linear";
};
type PanZoomUpdateOptions = {
	noWheelClassName: string;
	noPanClassName: string;
	onPaneContextMenu?: (event: MouseEvent) => void;
	preventScrolling: boolean;
	panActivationKeyPressed?: boolean;
	panOnScroll: boolean;
	panOnDrag: boolean | number[];
	panOnScrollMode: PanOnScrollMode;
	panOnScrollSpeed: number;
	userSelectionActive: boolean;
	zoomOnPinch: boolean;
	zoomOnScroll: boolean;
	zoomOnDoubleClick: boolean;
	zoomActivationKeyPressed: boolean;
	lib: string;
	onTransformChange: OnTransformChange;
	connectionInProgress: boolean;
	paneClickDistance: number;
	selectionOnDrag?: boolean;
};
type PanZoomInstance = {
	update: (params: PanZoomUpdateOptions) => void;
	destroy: () => void;
	getViewport: () => Viewport;
	setViewport: (viewport: Viewport, options?: PanZoomTransformOptions) => Promise<ZoomTransform | undefined>;
	setViewportConstrained: (viewport: Viewport, extent: CoordinateExtent, translateExtent: CoordinateExtent) => Promise<ZoomTransform | undefined>;
	setScaleExtent: (scaleExtent: [
		number,
		number
	]) => void;
	setTranslateExtent: (translateExtent: CoordinateExtent) => void;
	scaleTo: (scale: number, options?: PanZoomTransformOptions) => Promise<boolean>;
	scaleBy: (factor: number, options?: PanZoomTransformOptions) => Promise<boolean>;
	syncViewport: (viewport: Viewport) => void;
	setClickDistance: (distance: number) => void;
};
/**
 * This type is used to define the `onMove` handler.
 */
export type OnMove = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;
type ZoomInOut = (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
type GetZoom = () => number;
type GetViewport = () => Viewport;
/**
 * The `SetViewport` function is used to set the viewport of the flow.
 *
 * @inline
 * @param viewport - The viewport to set.
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
/**
 * The `SetCenter` function is used to set the center of the flow viewport to a specific position
 *
 * @inline
 * @param x - x coordinate
 * @param y - y coordinate
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type SetCenter = (x: number, y: number, options?: SetCenterOptions) => Promise<boolean>;
/**
 * The `FitBounds` function is used to fit the flow viewport to the bounds of the nodes.
 *
 * @inline
 * @param bounds - The bounds to fit the viewport to.
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => Promise<boolean>;
/**
 * The `Connection` type is the basic minimal description of an [`Edge`](/api-reference/types/edge)
 * between two nodes. The [`addEdge`](/api-reference/utils/add-edge) util can be used to upgrade
 * a `Connection` to an [`Edge`](/api-reference/types/edge).
 *
 * @public
 */
export type Connection = {
	/** The id of the node this connection originates from. */
	source: string;
	/** The id of the node this connection terminates at. */
	target: string;
	/** When not `null`, the id of the handle on the source node that this connection originates from. */
	sourceHandle: string | null;
	/** When not `null`, the id of the handle on the target node that this connection terminates at. */
	targetHandle: string | null;
};
/**
 * The `HandleConnection` type is an extension of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 */
export type HandleConnection = Connection & {
	edgeId: string;
};
/**
 * The `NodeConnection` type is an extension of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 *
 */
export type NodeConnection = Connection & {
	edgeId: string;
};
export type UseNodeConnectionsParams = {
	/** ID of the node, filled in automatically if used inside custom node. */
	id?: string;
	/** Gets called when a connection is established. */
	onConnect?: (connections: HandleConnection[]) => void;
	/** Gets called when a connection is removed. */
	onDisconnect?: (connections: HandleConnection[]) => void;
} & ({
	/** What type of handle connections do you want to observe? */
	handleType: HandleType;
	/** Filter by handle id (this is only needed if the node has multiple handles of the same type). Requires `handleType` to be set. */
	handleId?: string;
} | {
	handleType?: HandleType;
	handleId?: never;
});
/**
 * The `ConnectionMode` is used to set the mode of connection between nodes.
 * The `Strict` mode is the default one and only allows source to target edges.
 * `Loose` mode allows source to source and target to target edges as well.
 *
 * @public
 */
export declare enum ConnectionMode {
	Strict = "strict",
	Loose = "loose"
}
export type OnConnectStartParams = {
	nodeId: string | null;
	handleId: string | null;
	handleType: HandleType | null;
};
export type OnConnectStart = (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
export type OnConnect = (connection: Connection) => void;
export type OnConnectEnd<NodeType extends NodeBase = NodeBase> = (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState<InternalNodeBase<NodeType>>) => void;
export type OnReconnect<EdgeType extends EdgeBase = EdgeBase> = (oldEdge: EdgeType, newConnection: Connection) => void;
type IsValidConnection<EdgeType extends EdgeBase = EdgeBase> = (edge: EdgeType | Connection) => boolean;
type FitViewParamsBase<NodeType extends NodeBase> = {
	nodes: Map<string, InternalNodeBase<NodeType>>;
	width: number;
	height: number;
	panZoom: PanZoomInstance;
	minZoom: number;
	maxZoom: number;
};
type PaddingUnit = "px" | "%";
type PaddingWithUnit = `${number}${PaddingUnit}` | number;
type Padding = PaddingWithUnit | {
	top?: PaddingWithUnit;
	right?: PaddingWithUnit;
	bottom?: PaddingWithUnit;
	left?: PaddingWithUnit;
	x?: PaddingWithUnit;
	y?: PaddingWithUnit;
};
type FitViewOptionsBase<NodeType extends NodeBase = NodeBase> = {
	padding?: Padding;
	includeHiddenNodes?: boolean;
	minZoom?: number;
	maxZoom?: number;
	duration?: number;
	ease?: (t: number) => number;
	interpolate?: "smooth" | "linear";
	nodes?: (NodeType | {
		id: string;
	})[];
};
/**
 * Internally, React Flow maintains a coordinate system that is independent of the
 * rest of the page. The `Viewport` type tells you where in that system your flow
 * is currently being display at and how zoomed in or out it is.
 *
 * @public
 * @remarks A `Transform` has the same properties as the viewport, but they represent
 * different things. Make sure you don't get them muddled up or things will start
 * to look weird!
 *
 */
export type Viewport = {
	x: number;
	y: number;
	zoom: number;
};
export type KeyCode = string | Array<string>;
export type SnapGrid = [
	number,
	number
];
/**
 * This enum is used to set the different modes of panning the viewport when the
 * user scrolls. The `Free` mode allows the user to pan in any direction by scrolling
 * with a device like a trackpad. The `Vertical` and `Horizontal` modes restrict
 * scroll panning to only the vertical or horizontal axis, respectively.
 *
 * @public
 */
export declare enum PanOnScrollMode {
	Free = "free",
	Vertical = "vertical",
	Horizontal = "horizontal"
}
/**
 * @inline
 */
export type ViewportHelperFunctionOptions = {
	duration?: number;
	ease?: (t: number) => number;
	interpolate?: "smooth" | "linear";
};
/**
 * @inline
 */
export type SetCenterOptions = ViewportHelperFunctionOptions & {
	zoom?: number;
};
/**
 * @inline
 */
export type FitBoundsOptions = ViewportHelperFunctionOptions & {
	padding?: number;
};
type OnViewportChange = (viewport: Viewport) => void;
type UpdateNodeInternals = (nodeId: string | string[]) => void;
/**
 * This type is mostly used to help position things on top of the flow viewport. For
 * example both the [`<MiniMap />`](/api-reference/components/minimap) and
 * [`<Controls />`](/api-reference/components/controls) components take a `position`
 * prop of this type.
 *
 * @public
 */
export type PanelPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | "center-left" | "center-right";
declare enum SelectionMode$1 {
	Partial = "partial",
	Full = "full"
}
export type SelectionRect = Rect & {
	startX: number;
	startY: number;
};
export type OnError = (id: string, message: string) => void;
type UpdateNodePositions<NodeType extends InternalNodeBase = InternalNodeBase> = (dragItems: Map<string, NodeDragItem | NodeType>, dragging?: boolean) => void;
type PanBy = (delta: XYPosition) => Promise<boolean>;
export type NoConnection = {
	inProgress: false;
	isValid: null;
	from: null;
	fromHandle: null;
	fromPosition: null;
	fromNode: null;
	to: null;
	toHandle: null;
	toPosition: null;
	toNode: null;
	pointer: null;
};
export type ConnectionInProgress<NodeType extends InternalNodeBase = InternalNodeBase> = {
	/** Indicates whether a connection is currently in progress. */
	inProgress: true;
	/**
	 * If an ongoing connection is above a handle or inside the connection radius, this will be `true`
	 * or `false`, otherwise `null`.
	 */
	isValid: boolean | null;
	/** Returns the xy start position or `null` if no connection is in progress. */
	from: XYPosition;
	/** Returns the start handle or `null` if no connection is in progress. */
	fromHandle: Handle;
	/** Returns the side (called position) of the start handle or `null` if no connection is in progress. */
	fromPosition: Position;
	/** Returns the start node or `null` if no connection is in progress. */
	fromNode: NodeType;
	/** Returns the xy end position or `null` if no connection is in progress. */
	to: XYPosition;
	/** Returns the end handle or `null` if no connection is in progress. */
	toHandle: Handle | null;
	/** Returns the side (called position) of the end handle or `null` if no connection is in progress. */
	toPosition: Position;
	/** Returns the end node or `null` if no connection is in progress. */
	toNode: NodeType | null;
	/** Returns the pointer position or `null` if no connection is in progress. */
	pointer: XYPosition;
};
/**
 * The `ConnectionState` type bundles all information about an ongoing connection.
 * It is returned by the [`useConnection`](/api-reference/hooks/use-connection) hook.
 *
 * @public
 */
export type ConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> = ConnectionInProgress<NodeType> | NoConnection;
export type FinalConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> = (Omit<ConnectionInProgress<NodeType>, "inProgress" | "toPosition"> & {
	toPosition: Position | null;
}) | Omit<NoConnection, "inProgress">;
type UpdateConnection<NodeType extends InternalNodeBase = InternalNodeBase> = (params: ConnectionState<NodeType>) => void;
export type ColorModeClass = "light" | "dark";
export type ColorMode = ColorModeClass | "system";
type ConnectionLookup = Map<string, Map<string, HandleConnection>>;
type OnBeforeDeleteBase<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase> = ({ nodes, edges, }: {
	nodes: NodeType[];
	edges: EdgeType[];
}) => Promise<boolean | {
	nodes: NodeType[];
	edges: EdgeType[];
}>;
/**
 * The `ZIndexMode` type is used to define how z-indexing is calculated for nodes and edges.
 * `auto` mode will automatically manage z-indexing for selections and sub flows.
 * `basic` mode will only manage z-indexing for selections.
 * `manual` mode does not apply any automatic z-indexing.
 *
 * @public
 */
export type ZIndexMode = "auto" | "basic" | "manual";
type EdgeBase<EdgeData extends Record<string, unknown> = Record<string, unknown>, EdgeType extends string | undefined = string | undefined> = {
	/** Unique id of an edge. */
	id: string;
	/** Type of edge defined in `edgeTypes`. */
	type?: EdgeType;
	/** Id of source node. */
	source: string;
	/** Id of target node. */
	target: string;
	/** Id of source handle, only needed if there are multiple handles per node. */
	sourceHandle?: string | null;
	/** Id of target handle, only needed if there are multiple handles per node. */
	targetHandle?: string | null;
	animated?: boolean;
	hidden?: boolean;
	deletable?: boolean;
	selectable?: boolean;
	/** Arbitrary data passed to an edge. */
	data?: EdgeData;
	selected?: boolean;
	/**
	 * Set the marker on the beginning of an edge.
	 * @example 'arrow', 'arrowclosed' or custom marker
	 */
	markerStart?: EdgeMarkerType;
	/**
	 * Set the marker on the end of an edge.
	 * @example 'arrow', 'arrowclosed' or custom marker
	 */
	markerEnd?: EdgeMarkerType;
	zIndex?: number;
	ariaLabel?: string;
	/**
	 * ReactFlow renders an invisible path around each edge to make them easier to click or tap on.
	 * This property sets the width of that invisible path.
	 */
	interactionWidth?: number;
};
export type SmoothStepPathOptions = {
	offset?: number;
	borderRadius?: number;
	stepPosition?: number;
};
type StepPathOptions = {
	offset?: number;
};
export type BezierPathOptions = {
	curvature?: number;
};
type DefaultEdgeOptionsBase<EdgeType extends EdgeBase> = Omit<EdgeType, "id" | "source" | "target" | "sourceHandle" | "targetHandle" | "selected">;
/**
 * If you set the `connectionLineType` prop on your [`<ReactFlow />`](/api-reference/react-flow#connection-connectionLineType)
 *component, it will dictate the style of connection line rendered when creating
 *new edges.
 *
 * @public
 *
 * @remarks If you choose to render a custom connection line component, this value will be
 *passed to your component as part of its [`ConnectionLineComponentProps`](/api-reference/types/connection-line-component-props).
 */
export declare enum ConnectionLineType {
	Bezier = "default",
	Straight = "straight",
	Step = "step",
	SmoothStep = "smoothstep",
	SimpleBezier = "simplebezier"
}
/**
 * Edges can optionally have markers at the start and end of an edge. The `EdgeMarker`
 *type is used to configure those markers! Check the docs for [`MarkerType`](/api-reference/types/marker-type)
 *for details on what types of edge marker are available.
 *
 * @public
 */
export type EdgeMarker = {
	type: MarkerType | `${MarkerType}`;
	color?: string | null;
	width?: number;
	height?: number;
	markerUnits?: string;
	orient?: string;
	strokeWidth?: number;
};
export type EdgeMarkerType = string | EdgeMarker;
/**
 * Edges may optionally have a marker on either end. The MarkerType type enumerates
 * the options available to you when configuring a given marker.
 *
 * @public
 */
export declare enum MarkerType {
	Arrow = "arrow",
	ArrowClosed = "arrowclosed"
}
type EdgePosition = {
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition: Position;
	targetPosition: Position;
};
type EdgeLookup<EdgeType extends EdgeBase = EdgeBase> = Map<string, EdgeType>;
type EdgeToolbarBaseProps = {
	/**
	 * The `x` position of the edge toolbar.
	 */
	x: number;
	/**
	 * The `y` position of the edge toolbar.
	 */
	y: number;
	/** If `true`, edge toolbar is visible even if edge is not selected.
	 * @default false
	 */
	isVisible?: boolean;
	/**
	 * Align the vertical toolbar position relative to the passed x position.
	 * @default "center"
	 * @example 'left', 'center', 'right'
	 */
	alignX?: "left" | "center" | "right";
	/**
	 * Align the horizontal toolbar position relative to the passed y position.
	 * @default "center"
	 * @example 'top', 'center', 'bottom'
	 */
	alignY?: "top" | "center" | "bottom";
};
declare const defaultAriaLabelConfig: {
	"node.a11yDescription.default": string;
	"node.a11yDescription.keyboardDisabled": string;
	"node.a11yDescription.ariaLiveMessage": ({ direction, x, y }: {
		direction: string;
		x: number;
		y: number;
	}) => string;
	"edge.a11yDescription.default": string;
	"controls.ariaLabel": string;
	"controls.zoomIn.ariaLabel": string;
	"controls.zoomOut.ariaLabel": string;
	"controls.fitView.ariaLabel": string;
	"controls.interactive.ariaLabel": string;
	"minimap.ariaLabel": string;
	"handle.ariaLabel": string;
};
export type AriaLabelConfig = typeof defaultAriaLabelConfig;
export type GetBezierPathParams = {
	/** The `x` position of the source handle. */
	sourceX: number;
	/** The `y` position of the source handle. */
	sourceY: number;
	/**
	 * The position of the source handle.
	 * @default Position.Bottom
	 */
	sourcePosition?: Position;
	/** The `x` position of the target handle. */
	targetX: number;
	/** The `y` position of the target handle. */
	targetY: number;
	/**
	 * The position of the target handle.
	 * @default Position.Top
	 */
	targetPosition?: Position;
	/**
	 * The curvature of the bezier edge.
	 * @default 0.25
	 */
	curvature?: number;
};
export declare function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY, }: {
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourceControlX: number;
	sourceControlY: number;
	targetControlX: number;
	targetControlY: number;
}): [
	number,
	number,
	number,
	number
];
/**
 * The `getBezierPath` util returns everything you need to render a bezier edge
 *between two nodes.
 * @public
 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
 * and `offsetX`, `offsetY` between source handle and label.
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 * @example
 * ```js
 *  const source = { x: 0, y: 20 };
 *  const target = { x: 150, y: 100 };
 *
 *  const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({
 *    sourceX: source.x,
 *    sourceY: source.y,
 *    sourcePosition: Position.Right,
 *    targetX: target.x,
 *    targetY: target.y,
 *    targetPosition: Position.Left,
 *});
 *```
 *
 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to
 *work with multiple edge paths at once.
 */
export declare function getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature, }: GetBezierPathParams): [
	path: string,
	labelX: number,
	labelY: number,
	offsetX: number,
	offsetY: number
];
export type GetStraightPathParams = {
	/** The `x` position of the source handle. */
	sourceX: number;
	/** The `y` position of the source handle. */
	sourceY: number;
	/** The `x` position of the target handle. */
	targetX: number;
	/** The `y` position of the target handle. */
	targetY: number;
};
/**
 * Calculates the straight line path between two points.
 * @public
 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
 * and `offsetX`, `offsetY` between source handle and label.
 *
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 * @example
 * ```js
 *  const source = { x: 0, y: 20 };
 *  const target = { x: 150, y: 100 };
 *
 *  const [path, labelX, labelY, offsetX, offsetY] = getStraightPath({
 *    sourceX: source.x,
 *    sourceY: source.y,
 *    sourcePosition: Position.Right,
 *    targetX: target.x,
 *    targetY: target.y,
 *    targetPosition: Position.Left,
 *  });
 * ```
 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to work with multiple edge paths at once.
 */
export declare function getStraightPath({ sourceX, sourceY, targetX, targetY, }: GetStraightPathParams): [
	path: string,
	labelX: number,
	labelY: number,
	offsetX: number,
	offsetY: number
];
export interface GetSmoothStepPathParams {
	/** The `x` position of the source handle. */
	sourceX: number;
	/** The `y` position of the source handle. */
	sourceY: number;
	/**
	 * The position of the source handle.
	 * @default Position.Bottom
	 */
	sourcePosition?: Position;
	/** The `x` position of the target handle. */
	targetX: number;
	/** The `y` position of the target handle. */
	targetY: number;
	/**
	 * The position of the target handle.
	 * @default Position.Top
	 */
	targetPosition?: Position;
	/** @default 5 */
	borderRadius?: number;
	centerX?: number;
	centerY?: number;
	/** @default 20 */
	offset?: number;
	/**
	 * Controls where the bend occurs along the path.
	 * 0 = at source, 1 = at target, 0.5 = midpoint
	 * @default 0.5
	 */
	stepPosition?: number;
}
/**
 * The `getSmoothStepPath` util returns everything you need to render a stepped path
 * between two nodes. The `borderRadius` property can be used to choose how rounded
 * the corners of those steps are.
 * @public
 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
 * and `offsetX`, `offsetY` between source handle and label.
 *
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 * @example
 * ```js
 *  const source = { x: 0, y: 20 };
 *  const target = { x: 150, y: 100 };
 *
 *  const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
 *    sourceX: source.x,
 *    sourceY: source.y,
 *    sourcePosition: Position.Right,
 *    targetX: target.x,
 *    targetY: target.y,
 *    targetPosition: Position.Left,
 *  });
 * ```
 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to work with multiple edge paths at once.
 */
export declare function getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius, centerX, centerY, offset, stepPosition, }: GetSmoothStepPathParams): [
	path: string,
	labelX: number,
	labelY: number,
	offsetX: number,
	offsetY: number
];
export declare function getEdgeCenter({ sourceX, sourceY, targetX, targetY, }: {
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
}): [
	number,
	number,
	number,
	number
];
type GetEdgeId = (params: Connection | EdgeBase) => string;
type AddEdgeOptions = {
	/**
	 * Custom function to generate edge IDs. If not provided, the default `getEdgeId` function is used.
	 */
	getEdgeId?: GetEdgeId;
	/**
	 * Called when edge validation fails. If not provided, a default dev warning is used.
	 */
	onError?: OnError;
};
type ReconnectEdgeOptions = {
	/**
	 * Should the id of the old edge be replaced with the new connection id.
	 * @default true
	 */
	shouldReplaceId?: boolean;
	/**
	 * Custom function to generate edge IDs. If not provided, the default `getEdgeId` function is used.
	 */
	getEdgeId?: GetEdgeId;
	/**
	 * Called when edge validation fails. If not provided, a default dev warning is used.
	 */
	onError?: OnError;
};
/**
 * This util is used to tell you what nodes, if any, are connected to the given node
 * as the _target_ of an edge.
 * @public
 * @param node - The node to get the connected nodes from.
 * @param nodes - The array of all nodes.
 * @param edges - The array of all edges.
 * @returns An array of nodes that are connected over edges where the source is the given node.
 *
 * @example
 * ```ts
 *import { getOutgoers } from '@xyflow/react';
 *
 *const nodes = [];
 *const edges = [];
 *
 *const outgoers = getOutgoers(
 *  { id: '1', position: { x: 0, y: 0 }, data: { label: 'node' } },
 *  nodes,
 *  edges,
 *);
 *```
 */
export declare const getOutgoers: <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(node: NodeType | {
	id: string;
}, nodes: NodeType[], edges: EdgeType[]) => NodeType[];
/**
 * This util is used to tell you what nodes, if any, are connected to the given node
 * as the _source_ of an edge.
 * @public
 * @param node - The node to get the connected nodes from.
 * @param nodes - The array of all nodes.
 * @param edges - The array of all edges.
 * @returns An array of nodes that are connected over edges where the target is the given node.
 *
 * @example
 * ```ts
 *import { getIncomers } from '@xyflow/react';
 *
 *const nodes = [];
 *const edges = [];
 *
 *const incomers = getIncomers(
 *  { id: '1', position: { x: 0, y: 0 }, data: { label: 'node' } },
 *  nodes,
 *  edges,
 *);
 *```
 */
export declare const getIncomers: <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(node: NodeType | {
	id: string;
}, nodes: NodeType[], edges: EdgeType[]) => NodeType[];
type GetNodesBoundsParams<NodeType extends NodeBase = NodeBase> = {
	/**
	 * Origin of the nodes: `[0, 0]` for top-left, `[0.5, 0.5]` for center.
	 * @default [0, 0]
	 */
	nodeOrigin?: NodeOrigin;
	nodeLookup?: NodeLookup<InternalNodeBase<NodeType>>;
};
/**
 * Returns the bounding box that contains all the given nodes in an array. This can
 * be useful when combined with [`getViewportForBounds`](/api-reference/utils/get-viewport-for-bounds)
 * to calculate the correct transform to fit the given nodes in a viewport.
 * @public
 * @remarks Useful when combined with {@link getViewportForBounds} to calculate the correct transform to fit the given nodes in a viewport.
 * @param nodes - Nodes to calculate the bounds for.
 * @returns Bounding box enclosing all nodes.
 *
 * @remarks This function was previously called `getRectOfNodes`
 *
 * @example
 * ```js
 *import { getNodesBounds } from '@xyflow/react';
 *
 *const nodes = [
 *  {
 *    id: 'a',
 *    position: { x: 0, y: 0 },
 *    data: { label: 'a' },
 *    width: 50,
 *    height: 25,
 *  },
 *  {
 *    id: 'b',
 *    position: { x: 100, y: 100 },
 *    data: { label: 'b' },
 *    width: 50,
 *    height: 25,
 *  },
 *];
 *
 *const bounds = getNodesBounds(nodes);
 *```
 */
export declare const getNodesBounds: <NodeType extends NodeBase = NodeBase>(nodes: (NodeType | InternalNodeBase<NodeType> | string)[], params?: GetNodesBoundsParams<NodeType>) => Rect;
/**
 * This utility filters an array of edges, keeping only those where either the source or target
 * node is present in the given array of nodes.
 * @public
 * @param nodes - Nodes you want to get the connected edges for.
 * @param edges - All edges.
 * @returns Array of edges that connect any of the given nodes with each other.
 *
 * @example
 * ```js
 *import { getConnectedEdges } from '@xyflow/react';
 *
 *const nodes = [
 *  { id: 'a', position: { x: 0, y: 0 } },
 *  { id: 'b', position: { x: 100, y: 0 } },
 *];
 *
 *const edges = [
 *  { id: 'a->c', source: 'a', target: 'c' },
 *  { id: 'c->d', source: 'c', target: 'd' },
 *];
 *
 *const connectedEdges = getConnectedEdges(nodes, edges);
 * // => [{ id: 'a->c', source: 'a', target: 'c' }]
 *```
 */
export declare const getConnectedEdges: <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(nodes: NodeType[], edges: EdgeType[]) => EdgeType[];
/**
 * Returns a viewport that encloses the given bounds with padding.
 * @public
 * @remarks You can determine bounds of nodes with {@link getNodesBounds} and {@link getBoundsOfRects}
 * @param bounds - Bounds to fit inside viewport.
 * @param width - Width of the viewport.
 * @param height  - Height of the viewport.
 * @param minZoom - Minimum zoom level of the resulting viewport.
 * @param maxZoom - Maximum zoom level of the resulting viewport.
 * @param padding - Padding around the bounds.
 * @returns A transformed {@link Viewport} that encloses the given bounds which you can pass to e.g. {@link setViewport}.
 * @example
 * const { x, y, zoom } = getViewportForBounds(
 * { x: 0, y: 0, width: 100, height: 100},
 * 1200, 800, 0.5, 2);
 */
export declare const getViewportForBounds: (bounds: Rect, width: number, height: number, minZoom: number, maxZoom: number, padding: Padding) => Viewport;
declare function withResolvers<T>(): {
	promise: Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: unknown) => void;
};
/**
 * @public
 * @inline
 */
export type ResizeParams = {
	x: number;
	y: number;
	width: number;
	height: number;
};
export type ResizeParamsWithDirection = ResizeParams & {
	direction: number[];
};
/**
 * Used to determine the control line position of the NodeResizer
 *
 * @public
 * @inline
 */
export type ControlLinePosition = "top" | "bottom" | "left" | "right";
/**
 * Used to determine the control position of the NodeResizer
 *
 * @public
 * @inline
 */
export type ControlPosition = ControlLinePosition | "top-left" | "top-right" | "bottom-left" | "bottom-right";
/**
 * Used to determine the variant of the resize control
 *
 * @public
 */
export declare enum ResizeControlVariant {
	Line = "line",
	Handle = "handle"
}
type ResizeControlDirection = "horizontal" | "vertical";
type OnResizeHandler<Params = ResizeParams, Result = void> = (event: ResizeDragEvent, params: Params) => Result;
export type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
/**
 * Callback to determine if node should resize
 *
 * @inline
 * @public
 */
export type ShouldResize = OnResizeHandler<ResizeParamsWithDirection, boolean>;
export type OnResizeStart = OnResizeHandler;
export type OnResize = OnResizeHandler<ResizeParamsWithDirection>;
export type OnResizeEnd = OnResizeHandler;
/**
 * This type can be used to type the `onNodesChange` function with a custom node type.
 *
 * @public
 *
 * @example
 *
 * ```ts
 * const onNodesChange: OnNodesChange<MyNodeType> = useCallback((changes) => {
 *  setNodes((nodes) => applyNodeChanges(nodes, changes));
 * },[]);
 * ```
 */
export type OnNodesChange<NodeType extends Node$1 = Node$1> = (changes: NodeChange<NodeType>[]) => void;
/**
 * This type can be used to type the `onEdgesChange` function with a custom edge type.
 *
 * @public
 *
 * @example
 *
 * ```ts
 * const onEdgesChange: OnEdgesChange<MyEdgeType> = useCallback((changes) => {
 *  setEdges((edges) => applyEdgeChanges(edges, changes));
 * },[]);
 * ```
 */
export type OnEdgesChange<EdgeType extends Edge = Edge> = (changes: EdgeChange<EdgeType>[]) => void;
export type OnNodesDelete<NodeType extends Node$1 = Node$1> = (nodes: NodeType[]) => void;
export type OnEdgesDelete<EdgeType extends Edge = Edge> = (edges: EdgeType[]) => void;
/**
 * This type can be used to type the `onDelete` function with a custom node and edge type.
 *
 * @public
 */
export type OnDelete<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = (params: {
	nodes: NodeType[];
	edges: EdgeType[];
}) => void;
export type NodeTypes = Record<string, ComponentType<NodeProps$1 & {
	data: any;
	type: any;
}>>;
export type EdgeTypes = Record<string, ComponentType<EdgeProps & {
	data: any;
	type: any;
}>>;
export type UnselectNodesAndEdgesParams<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	nodes?: NodeType[];
	edges?: EdgeType[];
};
export type OnSelectionChangeParams<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	nodes: NodeType[];
	edges: EdgeType[];
};
export type OnSelectionChangeFunc<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = (params: OnSelectionChangeParams<NodeType, EdgeType>) => void;
/**
 * @inline
 */
export type FitViewParams<NodeType extends Node$1 = Node$1> = FitViewParamsBase<NodeType>;
/**
 * When calling [`fitView`](/api-reference/types/react-flow-instance#fitview) these options
 * can be used to customize the behaviour. For example, the `duration` option can be used to
 * transform the viewport smoothly over a given amount of time.
 *
 * @public
 * @inline
 */
export type FitViewOptions<NodeType extends Node$1 = Node$1> = FitViewOptionsBase<NodeType>;
/**
 * @inline
 */
export type FitView<NodeType extends Node$1 = Node$1> = (fitViewOptions?: FitViewOptions<NodeType>) => Promise<boolean>;
/**
 * @inline
 */
export type OnInit<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = (reactFlowInstance: ReactFlowInstance<NodeType, EdgeType>) => void;
/**
 * @inline
 */
export type ViewportHelperFunctions = {
	/**
	 * Zooms viewport in by 1.2.
	 *
	 * @param options.duration - optional duration. If set, a transition will be applied
	 */
	zoomIn: ZoomInOut;
	/**
	 * Zooms viewport out by 1 / 1.2.
	 *
	 * @param options.duration - optional duration. If set, a transition will be applied
	 */
	zoomOut: ZoomInOut;
	/**
	 * Zoom the viewport to a given zoom level. Passing in a `duration` will animate the viewport to
	 * the new zoom level.
	 *
	 * @param zoomLevel - the zoom level to set
	 * @param options.duration - optional duration. If set, a transition will be applied
	 */
	zoomTo: ZoomTo;
	/**
	 * Get the current zoom level of the viewport.
	 *
	 * @returns current zoom as a number
	 */
	getZoom: GetZoom;
	/**
	 * Sets the current viewport.
	 *
	 * @param viewport - the viewport to set
	 * @param options.duration - optional duration. If set, a transition will be applied
	 * @param options.ease - optional ease function.
	 */
	setViewport: SetViewport;
	/**
	 * Returns the current viewport.
	 *
	 * @returns Viewport
	 */
	getViewport: GetViewport;
	/**
	 * Center the viewport on a given position. Passing in a `duration` will animate the viewport to
	 * the new position.
	 *
	 * @param x - x position
	 * @param y - y position
	 * @param options.zoom - optional zoom
	 * @param options.duration - optional duration. If set, a transition will be applied
	 * @param options.ease - optional ease function.
	 */
	setCenter: SetCenter;
	/**
	 * A low-level utility function to fit the viewport to a given rectangle. By passing in a
	 * `duration`, the viewport will animate from its current position to the new position. The
	 * `padding` option can be used to add space around the bounds.
	 *
	 * @param bounds - the bounds ({ x: number, y: number, width: number, height: number }) to fit the view to
	 * @param options.padding - optional padding
	 * @param options.duration - optional duration. If set, a transition will be applied
	 * @param options.ease - optional ease function.
	 */
	fitBounds: FitBounds;
	/**
	 * With this function you can translate a screen pixel position to a flow position. It is useful
	 * for implementing drag and drop from a sidebar for example.
	 *
	 * @param clientPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
	 * @param options.snapToGrid - if true, the converted position will be snapped to the grid
	 * @returns position as { x: number, y: number }
	 *
	 * @example
	 * const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
	 */
	screenToFlowPosition: (clientPosition: XYPosition, options?: {
		snapToGrid?: boolean;
		snapGrid?: SnapGrid;
	}) => XYPosition;
	/**
	 * Translate a position inside the flow's canvas to a screen pixel position.
	 *
	 * @param flowPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
	 * @returns position as { x: number, y: number }
	 *
	 * @example
	 * const clientPosition = flowToScreenPosition({ x: node.position.x, y: node.position.y })
	 */
	flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
};
export type OnBeforeDelete<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = OnBeforeDeleteBase<NodeType, EdgeType>;
/**
 *  This type can be used to type the `isValidConnection` function.
 *  If the function returns `true`, the connection is valid and can be created.
 */
type IsValidConnection$1<EdgeType extends Edge = Edge> = (edge: EdgeType | Connection) => boolean;
/**
 * React Flow is independent and entirely funded by its users.
 * If you hide the attribution, please support our work by subscribing to React Flow Pro: https://reactflow.dev/remove-attribution
 * */
export type ProOptions = {
	account?: string;
	/** If you hide the attribution, please support our work with a subscription. */
	hideAttribution: boolean;
};
/**
 * The `Node` type represents everything React Flow needs to know about a given node.
 * Whenever you want to update a certain attribute of a node, you need to create a new
 * node object.
 *
 * @public
 */
type Node$1<NodeData extends Record<string, unknown> = Record<string, unknown>, NodeType extends string | undefined = string | undefined> = NodeBase<NodeData, NodeType> & {
	style?: CSSProperties;
	className?: string;
	resizing?: boolean;
	focusable?: boolean;
	/**
	 * The ARIA role attribute for the node element, used for accessibility.
	 * @default "group"
	 */
	ariaRole?: AriaRole;
	/**
	 * General escape hatch for adding custom attributes to the node's DOM element.
	 */
	domAttributes?: Omit<HTMLAttributes<HTMLDivElement>, "id" | "style" | "className" | "draggable" | "role" | "aria-label" | "defaultValue" | "dangerouslySetInnerHTML" | keyof DOMAttributes<HTMLDivElement>>;
};
/**
 * The `InternalNode` type is identical to the base [`Node`](/api-references/types/node)
 * type but is extended with some additional properties used internally.
 * Some functions and callbacks that return nodes may return an `InternalNode`.
 *
 * @public
 */
export type InternalNode<NodeType extends Node$1 = Node$1> = InternalNodeBase<NodeType>;
export type NodeMouseHandler<NodeType extends Node$1 = Node$1> = (event: ReactMouseEvent, node: NodeType) => void;
export type SelectionDragHandler<NodeType extends Node$1 = Node$1> = (event: ReactMouseEvent, nodes: NodeType[]) => void;
export type OnNodeDrag<NodeType extends Node$1 = Node$1> = (event: MouseEvent | TouchEvent, node: NodeType, nodes: NodeType[]) => void;
export type NodeWrapperProps<NodeType extends Node$1> = {
	id: string;
	nodesConnectable: boolean;
	elementsSelectable: boolean;
	nodesDraggable: boolean;
	nodesFocusable: boolean;
	onClick?: NodeMouseHandler<NodeType>;
	onDoubleClick?: NodeMouseHandler<NodeType>;
	onMouseEnter?: NodeMouseHandler<NodeType>;
	onMouseMove?: NodeMouseHandler<NodeType>;
	onMouseLeave?: NodeMouseHandler<NodeType>;
	onContextMenu?: NodeMouseHandler<NodeType>;
	resizeObserver: ResizeObserver | null;
	noDragClassName: string;
	noPanClassName: string;
	rfId: string;
	disableKeyboardA11y: boolean;
	nodeTypes?: NodeTypes;
	nodeExtent?: CoordinateExtent;
	onError?: OnError;
	nodeClickDistance?: number;
};
/**
 * The `BuiltInNode` type represents the built-in node types that are available in React Flow.
 * You can use this type to extend your custom node type if you still want to use the built-in ones.
 *
 * @public
 * @example
 * ```ts
 * type CustomNode = Node<{ value: number }, 'custom'>;
 * type MyAppNode = CustomNode | BuiltInNode;
 * ```
 */
export type BuiltInNode = Node$1<{
	label: string;
}, "input" | "output" | "default" | undefined> | Node$1<Record<string, never>, "group">;
/**
 * When you implement a [custom node](/learn/customization/custom-nodes) it is
 * wrapped in a component that enables basic functionality like selection and
 * dragging. Your custom node receives `NodeProps` as props.
 *
 * @public
 * @example
 * ```tsx
 *import { useState } from 'react';
 *import { NodeProps, Node } from '@xyflow/react';
 *
 *export type CounterNode = Node<{ initialCount?: number }, 'counter'>;
 *
 *export default function CounterNode(props: NodeProps<CounterNode>) {
 *  const [count, setCount] = useState(props.data?.initialCount ?? 0);
 *
 *  return (
 *    <div>
 *      <p>Count: {count}</p>
 *      <button className="nodrag" onClick={() => setCount(count + 1)}>
 *        Increment
 *      </button>
 *    </div>
 *  );
 *}
 *```
 */
type NodeProps$1<NodeType extends Node$1 = Node$1> = NodeProps<NodeType>;
/**
 * @inline
 */
export type EdgeLabelOptions = {
	/**
	 * The label or custom element to render along the edge. This is commonly a text label or some
	 * custom controls.
	 */
	label?: ReactNode;
	/**
	 * Custom styles to apply to the label.
	 */
	labelStyle?: CSSProperties;
	labelShowBg?: boolean;
	labelBgStyle?: CSSProperties;
	labelBgPadding?: [
		number,
		number
	];
	labelBgBorderRadius?: number;
};
/**
 * An `Edge` is the complete description with everything React Flow needs
 * to know in order to render it.
 * @public
 */
export type Edge<EdgeData extends Record<string, unknown> = Record<string, unknown>, EdgeType extends string | undefined = string | undefined> = EdgeBase<EdgeData, EdgeType> & EdgeLabelOptions & {
	style?: CSSProperties;
	className?: string;
	/**
	 * Determines whether the edge can be updated by dragging the source or target to a new node.
	 * This property will override the default set by the `edgesReconnectable` prop on the
	 * `<ReactFlow />` component.
	 */
	reconnectable?: boolean | HandleType;
	focusable?: boolean;
	/**
	 * The ARIA role attribute for the edge, used for accessibility.
	 * @default "group"
	 */
	ariaRole?: AriaRole;
	/**
	 * General escape hatch for adding custom attributes to the edge's DOM element.
	 */
	domAttributes?: Omit<SVGAttributes<SVGGElement>, "id" | "style" | "className" | "role" | "aria-label" | "dangerouslySetInnerHTML">;
};
type SmoothStepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, "smoothstep"> & {
	pathOptions?: SmoothStepPathOptions;
};
type BezierEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, "default"> & {
	pathOptions?: BezierPathOptions;
};
type StepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, "step"> & {
	pathOptions?: StepPathOptions;
};
type StraightEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, "straight">;
export type BuiltInEdge = SmoothStepEdge | BezierEdge | StepEdge | StraightEdge;
export type EdgeMouseHandler<EdgeType extends Edge = Edge> = (event: ReactMouseEvent, edge: EdgeType) => void;
export type EdgeWrapperProps<EdgeType extends Edge = Edge> = {
	id: string;
	edgesFocusable: boolean;
	edgesReconnectable: boolean;
	elementsSelectable: boolean;
	noPanClassName: string;
	onClick?: EdgeMouseHandler<EdgeType>;
	onDoubleClick?: EdgeMouseHandler<EdgeType>;
	onReconnect?: OnReconnect<EdgeType>;
	onContextMenu?: EdgeMouseHandler<EdgeType>;
	onMouseEnter?: EdgeMouseHandler<EdgeType>;
	onMouseMove?: EdgeMouseHandler<EdgeType>;
	onMouseLeave?: EdgeMouseHandler<EdgeType>;
	reconnectRadius?: number;
	onReconnectStart?: (event: ReactMouseEvent, edge: EdgeType, handleType: HandleType) => void;
	onReconnectEnd?: (event: MouseEvent | TouchEvent, edge: EdgeType, handleType: HandleType, connectionState: FinalConnectionState) => void;
	rfId?: string;
	edgeTypes?: EdgeTypes;
	onError?: OnError;
	disableKeyboardA11y?: boolean;
};
/**
 * Many properties on an [`Edge`](/api-reference/types/edge) are optional. When a new edge is created,
 * the properties that are not provided will be filled in with the default values
 * passed to the `defaultEdgeOptions` prop of the [`<ReactFlow />`](/api-reference/react-flow#defaultedgeoptions) component.
 */
export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;
export type EdgeTextProps = Omit<SVGAttributes<SVGElement>, "x" | "y"> & EdgeLabelOptions & {
	/** The x position where the label should be rendered. */
	x: number;
	/** The y position where the label should be rendered. */
	y: number;
};
/**
 * When you implement a custom edge it is wrapped in a component that enables some
 * basic functionality. The `EdgeProps` type is the props that are passed to this.
 * @public
 * @expand
 */
export type EdgeProps<EdgeType extends Edge = Edge> = Pick<EdgeType, "id" | "type" | "animated" | "data" | "style" | "selected" | "source" | "target" | "selectable" | "deletable"> & EdgePosition & EdgeLabelOptions & {
	sourceHandleId?: string | null;
	targetHandleId?: string | null;
	markerStart?: string;
	markerEnd?: string;
	pathOptions?: any;
	interactionWidth?: number;
};
/**
 * BaseEdge component props
 * @public
 * @expand
 */
export type BaseEdgeProps = Omit<SVGAttributes<SVGPathElement>, "d" | "path" | "markerStart" | "markerEnd"> & EdgeLabelOptions & {
	/**
	 * The width of the invisible area around the edge that the user can interact with. This is
	 * useful for making the edge easier to click or hover over.
	 * @default 20
	 */
	interactionWidth?: number;
	/** The x position of edge label */
	labelX?: number;
	/** The y position of edge label */
	labelY?: number;
	/**
	 * The SVG path string that defines the edge. This should look something like
	 * `'M 0 0 L 100 100'` for a simple line. The utility functions like `getSimpleBezierEdge` can
	 * be used to generate this string for you.
	 */
	path: string;
	/**
	 * The id of the SVG marker to use at the start of the edge. This should be defined in a
	 * `<defs>` element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
	 */
	markerStart?: string;
	/**
	 * The id of the SVG marker to use at the end of the edge. This should be defined in a `<defs>`
	 * element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
	 */
	markerEnd?: string;
};
/**
 * Helper type for edge components that get exported by the library
 * @public
 * @expand
 */
export type EdgeComponentProps = EdgePosition & EdgeLabelOptions & {
	id?: EdgeProps["id"];
	markerStart?: EdgeProps["markerStart"];
	markerEnd?: EdgeProps["markerEnd"];
	interactionWidth?: EdgeProps["interactionWidth"];
	style?: EdgeProps["style"];
	sourceHandleId?: EdgeProps["sourceHandleId"];
	targetHandleId?: EdgeProps["targetHandleId"];
};
export type EdgeComponentWithPathOptions<PathOptions> = EdgeComponentProps & {
	pathOptions?: PathOptions;
};
/**
 * BezierEdge component props
 * @public
 * @expand
 */
export type BezierEdgeProps = EdgeComponentWithPathOptions<BezierPathOptions>;
/**
 * SmoothStepEdge component props
 * @public
 * @expand
 */
export type SmoothStepEdgeProps = EdgeComponentWithPathOptions<SmoothStepPathOptions>;
/**
 * StepEdge component props
 * @public
 * @expand
 */
export type StepEdgeProps = EdgeComponentWithPathOptions<StepPathOptions>;
/**
 * StraightEdge component props
 * @public
 * @expand
 */
export type StraightEdgeProps = Omit<EdgeComponentProps, "sourcePosition" | "targetPosition">;
/**
 * SimpleBezier component props
 * @public
 * @expand
 */
export type SimpleBezierEdgeProps = EdgeComponentProps;
/**
 * If you want to render a custom component for connection lines, you can set the
 * `connectionLineComponent` prop on the [`<ReactFlow />`](/api-reference/react-flow#connection-connectionLineComponent)
 * component. The `ConnectionLineComponentProps` are passed to your custom component.
 *
 * @public
 */
export type ConnectionLineComponentProps<NodeType extends Node$1 = Node$1> = {
	connectionLineStyle?: CSSProperties;
	connectionLineType: ConnectionLineType;
	/** The node the connection line originates from. */
	fromNode: InternalNode<NodeType>;
	/** The handle on the `fromNode` that the connection line originates from. */
	fromHandle: Handle;
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	fromPosition: Position;
	toPosition: Position;
	/**
	 * If there is an `isValidConnection` callback, this prop will be set to `"valid"` or `"invalid"`
	 * based on the return value of that callback. Otherwise, it will be `null`.
	 */
	connectionStatus: "valid" | "invalid" | null;
	toNode: InternalNode<NodeType> | null;
	toHandle: Handle | null;
	pointer: XYPosition;
};
export type ConnectionLineComponent<NodeType extends Node$1 = Node$1> = ComponentType<ConnectionLineComponentProps<NodeType>>;
/**
 * ReactFlow component props.
 * @public
 */
export interface ReactFlowProps<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
	/**
	 * An array of nodes to render in a controlled flow.
	 * @default []
	 * @example
	 * const nodes = [
	 *  {
	 *    id: 'node-1',
	 *    type: 'input',
	 *    data: { label: 'Node 1' },
	 *    position: { x: 250, y: 50 }
	 *  }
	 * ];
	 */
	nodes?: NodeType[];
	/**
	 * An array of edges to render in a controlled flow.
	 * @default []
	 * @example
	 * const edges = [
	 *  {
	 *    id: 'edge-1-2',
	 *    source: 'node-1',
	 *    target: 'node-2',
	 *  }
	 * ];
	 */
	edges?: EdgeType[];
	/** The initial nodes to render in an uncontrolled flow. */
	defaultNodes?: NodeType[];
	/** The initial edges to render in an uncontrolled flow. */
	defaultEdges?: EdgeType[];
	/**
	 * Defaults to be applied to all new edges that are added to the flow.
	 * Properties on a new edge will override these defaults if they exist.
	 * @example
	 * const defaultEdgeOptions = {
	 *  type: 'customEdgeType',
	 *  animated: true
	 * }
	 */
	defaultEdgeOptions?: DefaultEdgeOptions;
	/** This event handler is called when a user clicks on a node. */
	onNodeClick?: NodeMouseHandler<NodeType>;
	/** This event handler is called when a user double-clicks on a node. */
	onNodeDoubleClick?: NodeMouseHandler<NodeType>;
	/** This event handler is called when mouse of a user enters a node. */
	onNodeMouseEnter?: NodeMouseHandler<NodeType>;
	/** This event handler is called when mouse of a user moves over a node. */
	onNodeMouseMove?: NodeMouseHandler<NodeType>;
	/** This event handler is called when mouse of a user leaves a node. */
	onNodeMouseLeave?: NodeMouseHandler<NodeType>;
	/** This event handler is called when a user right-clicks on a node. */
	onNodeContextMenu?: NodeMouseHandler<NodeType>;
	/** This event handler is called when a user starts to drag a node. */
	onNodeDragStart?: OnNodeDrag<NodeType>;
	/** This event handler is called when a user drags a node. */
	onNodeDrag?: OnNodeDrag<NodeType>;
	/** This event handler is called when a user stops dragging a node. */
	onNodeDragStop?: OnNodeDrag<NodeType>;
	/** This event handler is called when a user clicks on an edge. */
	onEdgeClick?: (event: ReactMouseEvent, edge: EdgeType) => void;
	/** This event handler is called when a user right-clicks on an edge. */
	onEdgeContextMenu?: EdgeMouseHandler<EdgeType>;
	/** This event handler is called when mouse of a user enters an edge. */
	onEdgeMouseEnter?: EdgeMouseHandler<EdgeType>;
	/** This event handler is called when mouse of a user moves over an edge. */
	onEdgeMouseMove?: EdgeMouseHandler<EdgeType>;
	/** This event handler is called when mouse of a user leaves an edge. */
	onEdgeMouseLeave?: EdgeMouseHandler<EdgeType>;
	/** This event handler is called when a user double-clicks on an edge. */
	onEdgeDoubleClick?: EdgeMouseHandler<EdgeType>;
	/**
	 * This handler is called when the source or target of a reconnectable edge is dragged from the
	 * current node. It will fire even if the edge's source or target do not end up changing.
	 * You can use the `reconnectEdge` utility to convert the connection to a new edge.
	 */
	onReconnect?: OnReconnect<EdgeType>;
	/**
	 * This event fires when the user begins dragging the source or target of an editable edge.
	 */
	onReconnectStart?: (event: ReactMouseEvent, edge: EdgeType, handleType: HandleType) => void;
	/**
	 * This event fires when the user releases the source or target of an editable edge. It is called
	 * even if an edge update does not occur.
	 */
	onReconnectEnd?: (event: MouseEvent | TouchEvent, edge: EdgeType, handleType: HandleType, connectionState: FinalConnectionState) => void;
	/**
	 * Use this event handler to add interactivity to a controlled flow.
	 * It is called on node drag, select, and move.
	 * @example // Use NodesState hook to create edges and get onNodesChange handler
	 * import ReactFlow, { useNodesState } from '@xyflow/react';
	 * const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	 *
	 * return (<ReactFlow onNodeChange={onNodeChange} {...rest} />)
	 * @example // Use helper function to update node
	 * import ReactFlow, { applyNodeChanges } from '@xyflow/react';
	 *
	 * const onNodeChange = useCallback(
	 *  (changes) => setNode((nds) => applyNodeChanges(changes, nds)),
	 *  [],
	 * );
	 *
	 * return (<ReactFlow onNodeChange={onNodeChange} {...rest} />)
	 */
	onNodesChange?: OnNodesChange<NodeType>;
	/**
	 * Use this event handler to add interactivity to a controlled flow. It is called on edge select
	 * and remove.
	 * @example // Use EdgesState hook to create edges and get onEdgesChange handler
	 * import ReactFlow, { useEdgesState } from '@xyflow/react';
	 * const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	 *
	 * return (<ReactFlow onEdgesChange={onEdgesChange} {...rest} />)
	 * @example // Use helper function to update edge
	 * import ReactFlow, { applyEdgeChanges } from '@xyflow/react';
	 *
	 * const onEdgesChange = useCallback(
	 *  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
	 *  [],
	 * );
	 *
	 * return (<ReactFlow onEdgesChange={onEdgesChange} {...rest} />)
	 */
	onEdgesChange?: OnEdgesChange<EdgeType>;
	/** This event handler gets called when a node is deleted. */
	onNodesDelete?: OnNodesDelete<NodeType>;
	/** This event handler gets called when an edge is deleted. */
	onEdgesDelete?: OnEdgesDelete<EdgeType>;
	/** This event handler gets called when a node or edge is deleted. */
	onDelete?: OnDelete<NodeType, EdgeType>;
	/** This event handler gets called when a user starts to drag a selection box. */
	onSelectionDragStart?: SelectionDragHandler<NodeType>;
	/** This event handler gets called when a user drags a selection box. */
	onSelectionDrag?: SelectionDragHandler<NodeType>;
	/** This event handler gets called when a user stops dragging a selection box. */
	onSelectionDragStop?: SelectionDragHandler<NodeType>;
	onSelectionStart?: (event: ReactMouseEvent) => void;
	onSelectionEnd?: (event: ReactMouseEvent) => void;
	/**
	 * This event handler is called when a user right-clicks on a node selection.
	 */
	onSelectionContextMenu?: (event: ReactMouseEvent, nodes: NodeType[]) => void;
	/**
	 * When a connection line is completed and two nodes are connected by the user, this event fires with the new connection.
	 * You can use the `addEdge` utility to convert the connection to a complete edge.
	 * @example // Use helper function to update edges onConnect
	 * import ReactFlow, { addEdge } from '@xyflow/react';
	 *
	 * const onConnect = useCallback(
	 *  (params) => setEdges((eds) => addEdge(params, eds)),
	 *  [],
	 * );
	 *
	 * return (<ReactFlow onConnect={onConnect} {...rest} />)
	 */
	onConnect?: OnConnect;
	/** This event handler gets called when a user starts to drag a connection line. */
	onConnectStart?: OnConnectStart;
	/**
	 * This callback will fire regardless of whether a valid connection could be made or not. You can
	 * use the second `connectionState` parameter to have different behavior when a connection was
	 * unsuccessful.
	 */
	onConnectEnd?: OnConnectEnd;
	onClickConnectStart?: OnConnectStart;
	onClickConnectEnd?: OnConnectEnd;
	/**
	 * The `onInit` callback is called when the viewport is initialized. At this point you can use the
	 * instance to call methods like `fitView` or `zoomTo`.
	 */
	onInit?: OnInit<NodeType, EdgeType>;
	/** This event handler is called while the user is either panning or zooming the viewport. */
	onMove?: OnMove;
	/** This event handler is called when the user begins to pan or zoom the viewport. */
	onMoveStart?: OnMoveStart;
	/**
	 * This event handler is called when panning or zooming viewport movement stops.
	 * If the movement is not user-initiated, the event parameter will be `null`.
	 */
	onMoveEnd?: OnMoveEnd;
	/** This event handler gets called when a user changes group of selected elements in the flow. */
	onSelectionChange?: OnSelectionChangeFunc<NodeType, EdgeType>;
	/** This event handler gets called when user scroll inside the pane. */
	onPaneScroll?: (event?: WheelEvent) => void;
	/** This event handler gets called when user clicks inside the pane. */
	onPaneClick?: (event: ReactMouseEvent) => void;
	/** This event handler gets called when user right clicks inside the pane. */
	onPaneContextMenu?: (event: ReactMouseEvent | MouseEvent) => void;
	/** This event handler gets called when mouse enters the pane. */
	onPaneMouseEnter?: (event: ReactMouseEvent) => void;
	/** This event handler gets called when mouse moves over the pane. */
	onPaneMouseMove?: (event: ReactMouseEvent) => void;
	/** This event handler gets called when mouse leaves the pane. */
	onPaneMouseLeave?: (event: ReactMouseEvent) => void;
	/**
	 * Distance that the mouse can move between mousedown/up that will trigger a click.
	 * @default 0
	 */
	paneClickDistance?: number;
	/**
	 * Distance that the mouse can move between mousedown/up that will trigger a click.
	 * @default 0
	 */
	nodeClickDistance?: number;
	/**
	 * This handler is called before nodes or edges are deleted, allowing the deletion to be aborted
	 * by returning `false` or modified by returning updated nodes and edges.
	 */
	onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
	/**
	 * Custom node types to be available in a flow.
	 * React Flow matches a node's type to a component in the `nodeTypes` object.
	 * @default {
	 *   input: InputNode,
	 *   default: DefaultNode,
	 *   output: OutputNode,
	 *   group: GroupNode
	 * }
	 * @example
	 * import CustomNode from './CustomNode';
	 *
	 * const nodeTypes = { nameOfNodeType: CustomNode };
	 */
	nodeTypes?: NodeTypes;
	/**
	 * Custom edge types to be available in a flow.
	 * React Flow matches an edge's type to a component in the `edgeTypes` object.
	 * @default {
	 *   default: BezierEdge,
	 *   straight: StraightEdge,
	 *   step: StepEdge,
	 *   smoothstep: SmoothStepEdge,
	 *   simplebezier: SimpleBezier
	 * }
	 * @example
	 * import CustomEdge from './CustomEdge';
	 *
	 * const edgeTypes = { nameOfEdgeType: CustomEdge };
	 */
	edgeTypes?: EdgeTypes;
	/**
	 * The type of edge path to use for connection lines.
	 * Although created edges can be of any type, React Flow needs to know what type of path to render for the connection line before the edge is created!
	 * @default ConnectionLineType.Bezier
	 */
	connectionLineType?: ConnectionLineType;
	/** Styles to be applied to the connection line. */
	connectionLineStyle?: CSSProperties;
	/** React Component to be used as a connection line. */
	connectionLineComponent?: ConnectionLineComponent<NodeType>;
	/** Styles to be applied to the container of the connection line. */
	connectionLineContainerStyle?: CSSProperties;
	/**
	 * A loose connection mode will allow you to connect handles with differing types, including
	 * source-to-source connections. However, it does not support target-to-target connections. Strict
	 * mode allows only connections between source handles and target handles.
	 * @default 'strict'
	 */
	connectionMode?: ConnectionMode;
	/**
	 * If set, pressing the key or chord will delete any selected nodes and edges. Passing an array
	 * represents multiple keys that can be pressed.
  
	 * For example, `["Delete", "Backspace"]` will delete selected elements when either key is pressed.
	 * @default 'Backspace'
	 */
	deleteKeyCode?: KeyCode | null;
	/**
	 * If set, holding this key will let you click and drag to draw a selection box around multiple
	 * nodes and edges. Passing an array represents multiple keys that can be pressed.
	 *
	 * For example, `["Shift", "Meta"]` will allow you to draw a selection box when either key is
	 * pressed.
	 * @default 'Shift'
	 */
	selectionKeyCode?: KeyCode | null;
	/**
	 * Select multiple elements with a selection box, without pressing down `selectionKey`.
	 * @default false
	 */
	selectionOnDrag?: boolean;
	/**
	 * When set to `"partial"`, when the user creates a selection box by click and dragging nodes that
	 * are only partially in the box are still selected.
	 * @default 'full'
	 */
	selectionMode?: SelectionMode$1;
	/**
	 * If a key is set, you can pan the viewport while that key is held down even if `panOnScroll`
	 * is set to `false`.
	 *
	 * By setting this prop to `null` you can disable this functionality.
	 * @default 'Space'
	 */
	panActivationKeyCode?: KeyCode | null;
	/**
	 * Pressing down this key you can select multiple elements by clicking.
	 * @default "Meta" for macOS, "Control" for other systems
	 */
	multiSelectionKeyCode?: KeyCode | null;
	/**
	 * If a key is set, you can zoom the viewport while that key is held down even if `panOnScroll`
	 * is set to `false`.
	 *
	 * By setting this prop to `null` you can disable this functionality.
	 * @default "Meta" for macOS, "Control" for other systems
	 *
	 */
	zoomActivationKeyCode?: KeyCode | null;
	/** When enabled, nodes will snap to the grid when dragged. */
	snapToGrid?: boolean;
	/**
	 * If `snapToGrid` is enabled, this prop configures the grid that nodes will snap to.
	 * @example [20, 20]
	 */
	snapGrid?: SnapGrid;
	/**
	 * You can enable this optimisation to instruct React Flow to only render nodes and edges that would be visible in the viewport.
	 *
	 * This might improve performance when you have a large number of nodes and edges but also adds an overhead.
	 * @default false
	 */
	onlyRenderVisibleElements?: boolean;
	/**
	 * Controls whether all nodes should be draggable or not. Individual nodes can override this
	 * setting by setting their `draggable` prop. If you want to use the mouse handlers on
	 * non-draggable nodes, you need to add the `"nopan"` class to those nodes.
	 * @default true
	 */
	nodesDraggable?: boolean;
	/**
	 * When `true`, the viewport will pan when a node is focused.
	 * @default true
	 */
	autoPanOnNodeFocus?: boolean;
	/**
	 * Controls whether all nodes should be connectable or not. Individual nodes can override this
	 * setting by setting their `connectable` prop.
	 * @default true
	 */
	nodesConnectable?: boolean;
	/**
	 * When `true`, focus between nodes can be cycled with the `Tab` key and selected with the `Enter`
	 * key. This option can be overridden by individual nodes by setting their `focusable` prop.
	 * @default true
	 */
	nodesFocusable?: boolean;
	/**
	 * The origin of the node to use when placing it in the flow or looking up its `x` and `y`
	 * position. An origin of `[0, 0]` means that a node's top left corner will be placed at the `x`
	 * and `y` position.
	 * @default [0, 0]
	 * @example
	 * [0, 0] // default, top left
	 * [0.5, 0.5] // center
	 * [1, 1] // bottom right
	 */
	nodeOrigin?: NodeOrigin;
	/**
	 * When `true`, focus between edges can be cycled with the `Tab` key and selected with the `Enter`
	 * key. This option can be overridden by individual edges by setting their `focusable` prop.
	 * @default true
	 */
	edgesFocusable?: boolean;
	/**
	 * Whether edges can be updated once they are created. When both this prop is `true` and an
	 * `onReconnect` handler is provided, the user can drag an existing edge to a new source or
	 * target. Individual edges can override this value with their reconnectable property.
	 * @default true
	 */
	edgesReconnectable?: boolean;
	/**
	 * When `true`, elements (nodes and edges) can be selected by clicking on them. This option can be
	 * overridden by individual elements by setting their `selectable` prop.
	 * @default true
	 */
	elementsSelectable?: boolean;
	/**
	 * If `true`, nodes get selected on drag.
	 * @default true
	 */
	selectNodesOnDrag?: boolean;
	/**
	 * Enabling this prop allows users to pan the viewport by clicking and dragging.
	 * You can also set this prop to an array of numbers to limit which mouse buttons can activate panning.
	 * Mouse button arrays do not disable touch panning; set this prop to `false` to disable all drag panning.
	 * @default true
	 * @example [0, 2] // allows panning with the left and right mouse buttons
	 * [0, 1, 2, 3, 4] // allows panning with all mouse buttons
	 */
	panOnDrag?: boolean | number[];
	/**
	 * Minimum zoom level.
	 * @default 0.5
	 */
	minZoom?: number;
	/**
	 * Maximum zoom level.
	 * @default 2
	 */
	maxZoom?: number;
	/**
	 * When you pass a `viewport` prop, it's controlled, and you also need to pass `onViewportChange`
	 * to handle internal changes.
	 */
	viewport?: Viewport;
	/**
	 * Sets the initial position and zoom of the viewport. If a default viewport is provided but
	 * `fitView` is enabled, the default viewport will be ignored.
	 * @default { x: 0, y: 0, zoom: 1 }
	 * @example
	 * const initialViewport = {
	 *  zoom: 0.5,
	 *  position: { x: 0, y: 0 }
	 * };
	 */
	defaultViewport?: Viewport;
	/**
	 * Used when working with a controlled viewport for updating the user viewport state.
	 */
	onViewportChange?: (viewport: Viewport) => void;
	/**
	 * By default, the viewport extends infinitely. You can use this prop to set a boundary.
	 * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
	 * @default [[-∞, -∞], [+∞, +∞]]
	 * @example [[-1000, -10000], [1000, 1000]]
	 */
	translateExtent?: CoordinateExtent;
	/**
	 * Disabling this prop will allow the user to scroll the page even when their pointer is over the flow.
	 * @default true
	 */
	preventScrolling?: boolean;
	/**
	 * By default, nodes can be placed on an infinite flow. You can use this prop to set a boundary.
	 * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
	 * @example [[-1000, -10000], [1000, 1000]]
	 */
	nodeExtent?: CoordinateExtent;
	/**
	 * Color of edge markers.
	 * You can pass `null` to use the CSS variable `--xy-edge-stroke` for the marker color.
	 * @default '#b1b1b7'
	 */
	defaultMarkerColor?: string | null;
	/**
	 * Controls if the viewport should zoom by scrolling inside the container.
	 * @default true
	 */
	zoomOnScroll?: boolean;
	/**
	 * Controls if the viewport should zoom by pinching on a touch screen.
	 * @default true
	 */
	zoomOnPinch?: boolean;
	/**
	 * Controls if the viewport should pan by scrolling inside the container.
	 * Can be limited to a specific direction with `panOnScrollMode`.
	 * @default false
	 */
	panOnScroll?: boolean;
	/**
	 * Controls how fast viewport should be panned on scroll.
	 * Use together with `panOnScroll` prop.
	 * @default 0.5
	 */
	panOnScrollSpeed?: number;
	/**
	 * This prop is used to limit the direction of panning when `panOnScroll` is enabled.
	 * The `"free"` option allows panning in any direction.
	 * @default "free"
	 * @example "horizontal" | "vertical"
	 */
	panOnScrollMode?: PanOnScrollMode;
	/**
	 * Controls if the viewport should zoom by double-clicking somewhere on the flow.
	 * @default true
	 */
	zoomOnDoubleClick?: boolean;
	/**
	 * The radius around an edge connection that can trigger an edge reconnection.
	 * @default 10
	 */
	reconnectRadius?: number;
	/**
	 * If a node is draggable, clicking and dragging that node will move it around the canvas. Adding
	 * the `"nodrag"` class prevents this behavior and this prop allows you to change the name of that
	 * class.
	 * @default "nodrag"
	 */
	noDragClassName?: string;
	/**
	 * Typically, scrolling the mouse wheel when the mouse is over the canvas will zoom the viewport.
	 * Adding the `"nowheel"` class to an element in the canvas will prevent this behavior and this prop
	 * allows you to change the name of that class.
	 * @default "nowheel"
	 */
	noWheelClassName?: string;
	/**
	 * If an element in the canvas does not stop mouse events from propagating, clicking and dragging
	 * that element will pan the viewport. Adding the `"nopan"` class prevents this behavior and this
	 * prop allows you to change the name of that class.
	 * @default "nopan"
	 */
	noPanClassName?: string;
	/** When `true`, the flow will be zoomed and panned to fit all the nodes initially provided. */
	fitView?: boolean;
	/**
	 * When you typically call `fitView` on a `ReactFlowInstance`, you can provide an object of
	 * options to customize its behavior. This prop lets you do the same for the initial `fitView`
	 * call.
	 * @example
	 * const fitViewOptions = {
	 *  padding: 0.1,
	 *  includeHiddenNodes: false,
	 *  minZoom: 0.1,
	 *  maxZoom: 1,
	 *  duration: 200,
	 *  nodes: [{id: 'node-1'}, {id: 'node-2'}], // nodes to fit
	 * };
	 */
	fitViewOptions?: FitViewOptions;
	/**
	 * The `connectOnClick` option lets you click or tap on a source handle to start a connection
	 * and then click on a target handle to complete the connection.
	 *
	 * If you set this option to `false`, users will need to drag the connection line to the target
	 * handle to create a connection.
	 * @default true
	 */
	connectOnClick?: boolean;
	/**
	 * By default, React Flow will render a small attribution in the bottom right corner of the flow.
	 *
	 * You can use this prop to change its position in case you want to place something else there.
	 * @default 'bottom-right'
	 * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
	 */
	attributionPosition?: PanelPosition;
	/**
	 * By default, we render a small attribution in the corner of your flows that links back to the project.
	 *
	 * Please only remove the attribution if you have a React Flow subscription.
	 * More information in the {@link https://reactflow.dev/remove-attribution | removing attribution guide}.
	 */
	proOptions?: ProOptions;
	/**
	 * Enabling this option will raise the z-index of nodes when they are selected.
	 * @default true
	 */
	elevateNodesOnSelect?: boolean;
	/**
	 * Enabling this option will raise the z-index of edges when they are selected.
	 * @default false
	 */
	elevateEdgesOnSelect?: boolean;
	/**
	 * You can use this prop to disable keyboard accessibility features such as selecting nodes or
	 * moving selected nodes with the arrow keys.
	 * @default false
	 */
	disableKeyboardA11y?: boolean;
	/**
	 * When `true`, the viewport will pan automatically when the cursor moves to the edge of the
	 * viewport while dragging a node.
	 * @default true
	 */
	autoPanOnNodeDrag?: boolean;
	/**
	 * When `true`, the viewport will pan automatically when the cursor moves to the edge of the
	 * viewport while creating a connection.
	 * @default true
	 */
	autoPanOnConnect?: boolean;
	/**
	 * When `true`, the viewport will pan automatically when the cursor moves to the edge of the
	 * viewport while creating a selection box.
	 * @default true
	 */
	autoPanOnSelection?: boolean;
	/**
	 * The speed at which the viewport pans while dragging a node or a selection box.
	 * @default 15
	 */
	autoPanSpeed?: number;
	/**
	 * The radius around a handle where you drop a connection line to create a new edge.
	 * @default 20
	 */
	connectionRadius?: number;
	/**
	 * Occasionally something may happen that causes React Flow to throw an error.
	 *
	 * Instead of exploding your application, we log a message to the console and then call this event handler.
	 * You might use it for additional logging or to show a message to the user.
	 */
	onError?: OnError;
	/**
	 * This callback can be used to validate a new connection
	 *
	 * If you return `false`, the edge will not be added to your flow.
	 * If you have custom connection logic its preferred to use this callback over the
	 * `isValidConnection` prop on the handle component for performance reasons.
	 */
	isValidConnection?: IsValidConnection$1<EdgeType>;
	/**
	 * With a threshold greater than zero you can delay node drag events.
	 * If threshold equals 1, you need to drag the node 1 pixel before a drag event is fired.
	 * 1 is the default value, so that clicks don't trigger drag events.
	 * @default 1
	 */
	nodeDragThreshold?: number;
	/**
	 * The threshold in pixels that the mouse must move before a connection line starts to drag.
	 * This is useful to prevent accidental connections when clicking on a handle.
	 * @default 1
	 */
	connectionDragThreshold?: number;
	/** Sets a fixed width for the flow. */
	width?: number;
	/** Sets a fixed height for the flow. */
	height?: number;
	/**
	 * Controls color scheme used for styling the flow.
	 * @default 'light'
	 * @example 'system' | 'light' | 'dark'
	 */
	colorMode?: ColorMode;
	/**
	 * If set `true`, some debug information will be logged to the console like which events are fired.
	 * @default false
	 */
	debug?: boolean;
	/**
	 * Configuration for customizable labels, descriptions, and UI text. Provided keys will override the corresponding defaults.
	 * Allows localization, customization of ARIA descriptions, control labels, minimap labels, and other UI strings.
	 */
	ariaLabelConfig?: Partial<AriaLabelConfig>;
	/**
	 * Used to define how z-indexing is calculated for nodes and edges.
	 * 'auto' is for selections and sub flows, 'basic' for selections only, and 'manual' for no auto z-indexing.
	 *
	 * @default 'basic'
	 */
	zIndexMode?: ZIndexMode;
}
export type ReactFlowStore<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	rfId: string;
	width: number;
	height: number;
	transform: Transform;
	nodes: NodeType[];
	nodesInitialized: boolean;
	nodeLookup: NodeLookup<InternalNode<NodeType>>;
	parentLookup: ParentLookup<InternalNode<NodeType>>;
	edges: EdgeType[];
	edgeLookup: EdgeLookup<EdgeType>;
	connectionLookup: ConnectionLookup;
	onNodesChange: OnNodesChange<NodeType> | null;
	onEdgesChange: OnEdgesChange<EdgeType> | null;
	hasDefaultNodes: boolean;
	hasDefaultEdges: boolean;
	domNode: HTMLDivElement | null;
	paneDragging: boolean;
	noPanClassName: string;
	panZoom: PanZoomInstance | null;
	minZoom: number;
	maxZoom: number;
	translateExtent: CoordinateExtent;
	nodeExtent: CoordinateExtent;
	nodeOrigin: NodeOrigin;
	nodeDragThreshold: number;
	connectionDragThreshold: number;
	nodesSelectionActive: boolean;
	userSelectionActive: boolean;
	userSelectionRect: SelectionRect | null;
	connection: ConnectionState<InternalNode<NodeType>>;
	connectionMode: ConnectionMode;
	connectionClickStartHandle: (Pick<Handle, "nodeId" | "id"> & Required<Pick<Handle, "type">>) | null;
	snapToGrid: boolean;
	snapGrid: SnapGrid;
	nodesDraggable: boolean;
	autoPanOnNodeFocus: boolean;
	nodesConnectable: boolean;
	nodesFocusable: boolean;
	edgesFocusable: boolean;
	edgesReconnectable: boolean;
	elementsSelectable: boolean;
	elevateNodesOnSelect: boolean;
	elevateEdgesOnSelect: boolean;
	selectNodesOnDrag: boolean;
	multiSelectionActive: boolean;
	onNodeDragStart: OnNodeDrag<NodeType> | undefined;
	onNodeDrag: OnNodeDrag<NodeType> | undefined;
	onNodeDragStop: OnNodeDrag<NodeType> | undefined;
	onSelectionDragStart: OnSelectionDrag | undefined;
	onSelectionDrag: OnSelectionDrag | undefined;
	onSelectionDragStop: OnSelectionDrag | undefined;
	onMoveStart: OnMoveStart | undefined;
	onMove: OnMove | undefined;
	onMoveEnd: OnMoveEnd | undefined;
	onConnect: OnConnect | undefined;
	onConnectStart: OnConnectStart | undefined;
	onConnectEnd: OnConnectEnd | undefined;
	onClickConnectStart: OnConnectStart | undefined;
	onClickConnectEnd: OnConnectEnd | undefined;
	connectOnClick: boolean;
	defaultEdgeOptions: DefaultEdgeOptions | undefined;
	fitViewQueued: boolean;
	fitViewOptions: FitViewOptions | undefined;
	fitViewResolver: ReturnType<typeof withResolvers<boolean>> | null;
	onNodesDelete: OnNodesDelete<NodeType> | undefined;
	onEdgesDelete: OnEdgesDelete<EdgeType> | undefined;
	onDelete: OnDelete | undefined;
	onError: OnError | undefined;
	onViewportChangeStart: OnViewportChange | undefined;
	onViewportChange: OnViewportChange | undefined;
	onViewportChangeEnd: OnViewportChange | undefined;
	onBeforeDelete: OnBeforeDelete<NodeType, EdgeType> | undefined;
	onSelectionChangeHandlers: OnSelectionChangeFunc<NodeType, EdgeType>[];
	ariaLiveMessage: string;
	autoPanOnConnect: boolean;
	autoPanOnNodeDrag: boolean;
	autoPanSpeed: number;
	connectionRadius: number;
	isValidConnection: IsValidConnection$1<EdgeType> | undefined;
	lib: string;
	debug: boolean;
	ariaLabelConfig: AriaLabelConfig;
	zIndexMode: ZIndexMode;
	onNodesChangeMiddlewareMap: Map<symbol, (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]>;
	onEdgesChangeMiddlewareMap: Map<symbol, (changes: EdgeChange<EdgeType>[]) => EdgeChange<EdgeType>[]>;
};
export type ReactFlowActions<NodeType extends Node$1, EdgeType extends Edge> = {
	setNodes: (nodes: NodeType[]) => void;
	setEdges: (edges: EdgeType[]) => void;
	setDefaultNodesAndEdges: (nodes?: NodeType[], edges?: EdgeType[]) => void;
	updateNodeInternals: (updates: Map<string, InternalNodeUpdate>, params?: {
		triggerFitView: boolean;
	}) => void;
	updateNodePositions: UpdateNodePositions;
	resetSelectedElements: () => void;
	unselectNodesAndEdges: (params?: UnselectNodesAndEdgesParams<NodeType, EdgeType>) => void;
	addSelectedNodes: (nodeIds: string[]) => void;
	addSelectedEdges: (edgeIds: string[]) => void;
	setMinZoom: (minZoom: number) => void;
	setMaxZoom: (maxZoom: number) => void;
	setTranslateExtent: (translateExtent: CoordinateExtent) => void;
	setNodeExtent: (nodeExtent: CoordinateExtent) => void;
	cancelConnection: () => void;
	updateConnection: UpdateConnection<InternalNode<NodeType>>;
	reset: () => void;
	triggerNodeChanges: (changes: NodeChange<NodeType>[]) => void;
	triggerEdgeChanges: (changes: EdgeChange<EdgeType>[]) => void;
	panBy: PanBy;
	setCenter: SetCenter;
};
export type ReactFlowState<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = ReactFlowStore<NodeType, EdgeType> & ReactFlowActions<NodeType, EdgeType>;
export type ReactFlowJsonObject<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	nodes: NodeType[];
	edges: EdgeType[];
	viewport: Viewport;
};
export type DeleteElementsOptions = {
	nodes?: (Node$1 | {
		id: Node$1["id"];
	})[];
	edges?: (Edge | {
		id: Edge["id"];
	})[];
};
/**
 * @inline
 */
export type GeneralHelpers<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	/**
	 * Returns nodes.
	 *
	 * @returns nodes array
	 */
	getNodes: () => NodeType[];
	/**
	 * Set your nodes array to something else by either overwriting it with a new array or by passing
	 * in a function to update the existing array. If using a function, it is important to make sure a
	 * new array is returned instead of mutating the existing array. Calling this function will
	 * trigger the `onNodesChange` handler in a controlled flow.
	 *
	 * @param payload - the nodes to set or a function that receives the current nodes and returns the new nodes
	 */
	setNodes: (payload: NodeType[] | ((nodes: NodeType[]) => NodeType[])) => void;
	/**
	 * Add one or many nodes to your existing nodes array. Calling this function will trigger the
	 * `onNodesChange` handler in a controlled flow.
	 *
	 * @param payload - the nodes to add
	 */
	addNodes: (payload: NodeType[] | NodeType) => void;
	/**
	 * Returns a node by id.
	 *
	 * @param id - the node id
	 * @returns the node or undefined if no node was found
	 */
	getNode: (id: string) => NodeType | undefined;
	/**
	 * Returns an internal node by id.
	 *
	 * @param id - the node id
	 * @returns the internal node or undefined if no node was found
	 */
	getInternalNode: (id: string) => InternalNode<NodeType> | undefined;
	/**
	 * Returns edges.
	 *
	 * @returns edges array
	 */
	getEdges: () => EdgeType[];
	/**
	 * Set your edges array to something else by either overwriting it with a new array or by passing
	 * in a function to update the existing array. If using a function, it is important to make sure a
	 * new array is returned instead of mutating the existing array. Calling this function will
	 * trigger the `onEdgesChange` handler in a controlled flow.
	 *
	 * @param payload - the edges to set or a function that receives the current edges and returns the new edges
	 */
	setEdges: (payload: EdgeType[] | ((edges: EdgeType[]) => EdgeType[])) => void;
	/**
	 * Add one or many edges to your existing edges array. Calling this function will trigger the
	 * `onEdgesChange` handler in a controlled flow.
	 *
	 * @param payload - the edges to add
	 */
	addEdges: (payload: EdgeType[] | EdgeType) => void;
	/**
	 * Returns an edge by id.
	 *
	 * @param id - the edge id
	 * @returns the edge or undefined if no edge was found
	 */
	getEdge: (id: string) => EdgeType | undefined;
	/**
	 * Returns the nodes, edges and the viewport as a JSON object.
	 *
	 * @returns the nodes, edges and the viewport as a JSON object
	 */
	toObject: () => ReactFlowJsonObject<NodeType, EdgeType>;
	/**
	 * Deletes nodes and edges.
	 *
	 * @param params.nodes - optional nodes array to delete
	 * @param params.edges - optional edges array to delete
	 *
	 * @returns a promise that resolves with the deleted nodes and edges
	 */
	deleteElements: (params: DeleteElementsOptions) => Promise<{
		deletedNodes: Node$1[];
		deletedEdges: Edge[];
	}>;
	/**
	 * Find all the nodes currently intersecting with a given node or rectangle. The `partially`
	 * parameter can be set to `true` to include nodes that are only partially intersecting.
	 *
	 * @param node - the node or rect to check for intersections
	 * @param partially - true by default, if set to false, only nodes that are fully intersecting will be returned
	 * @param nodes - optional nodes array to check for intersections
	 *
	 * @returns an array of intersecting nodes
	 */
	getIntersectingNodes: (node: NodeType | {
		id: Node$1["id"];
	} | Rect, partially?: boolean, nodes?: NodeType[]) => NodeType[];
	/**
	 * Determine if a given node or rectangle is intersecting with another rectangle. The `partially`
	 * parameter can be set to true return `true` even if the node is only partially intersecting.
	 *
	 * @param node - the node or rect to check for intersections
	 * @param area - the rect to check for intersections
	 * @param partially - if true, the node is considered to be intersecting if it partially overlaps with the passed react
	 *
	 * @returns true if the node or rect intersects with the given area
	 */
	isNodeIntersecting: (node: NodeType | {
		id: Node$1["id"];
	} | Rect, area: Rect, partially?: boolean) => boolean;
	/**
	 * Updates a node.
	 *
	 * @param id - id of the node to update
	 * @param nodeUpdate - the node update as an object or a function that receives the current node and returns the node update
	 * @param options.replace - if true, the node is replaced with the node update, otherwise the changes get merged
	 *
	 * @example
	 * updateNode('node-1', (node) => ({ position: { x: node.position.x + 10, y: node.position.y } }));
	 */
	updateNode: (id: string, nodeUpdate: Partial<NodeType> | ((node: NodeType) => Partial<NodeType>), options?: {
		replace: boolean;
	}) => void;
	/**
	 * Updates the data attribute of a node.
	 *
	 * @param id - id of the node to update
	 * @param dataUpdate - the data update as an object or a function that receives the current data and returns the data update
	 * @param options.replace - if true, the data is replaced with the data update, otherwise the changes get merged
	 *
	 * @example
	 * updateNodeData('node-1', { label: 'A new label' });
	 */
	updateNodeData: (id: string, dataUpdate: Partial<NodeType["data"]> | ((node: NodeType) => Partial<NodeType["data"]>), options?: {
		replace: boolean;
	}) => void;
	/**
	 * Updates an edge.
	 *
	 * @param id - id of the edge to update
	 * @param edgeUpdate - the edge update as an object or a function that receives the current edge and returns the edge update
	 * @param options.replace - if true, the edge is replaced with the edge update, otherwise the changes get merged
	 *
	 * @example
	 * updateEdge('edge-1', (edge) => ({ label: 'A new label' }));
	 */
	updateEdge: (id: string, edgeUpdate: Partial<EdgeType> | ((edge: EdgeType) => Partial<EdgeType>), options?: {
		replace: boolean;
	}) => void;
	/**
	 * Updates the data attribute of a edge.
	 *
	 * @param id - id of the edge to update
	 * @param dataUpdate - the data update as an object or a function that receives the current data and returns the data update
	 * @param options.replace - if true, the data is replaced with the data update, otherwise the changes get merged
	 *
	 * @example
	 * updateEdgeData('edge-1', { label: 'A new label' });
	 */
	updateEdgeData: (id: string, dataUpdate: Partial<EdgeType["data"]> | ((edge: EdgeType) => Partial<EdgeType["data"]>), options?: {
		replace: boolean;
	}) => void;
	/**
	 * Returns the bounds of the given nodes or node ids.
	 *
	 * @param nodes - the nodes or node ids to calculate the bounds for
	 *
	 * @returns the bounds of the given nodes
	 */
	getNodesBounds: (nodes: (NodeType | InternalNode | string)[]) => Rect;
	/**
	 * Get all the connections of a handle belonging to a specific node. The type parameter be either
	 * `'source'` or `'target'`.
	 * @deprecated
	 * @param type - handle type 'source' or 'target'
	 * @param id - the handle id (this is only needed if you have multiple handles of the same type, meaning you have to provide a unique id for each handle)
	 * @param nodeId - the node id the handle belongs to
	 * @returns an array with handle connections
	 */
	getHandleConnections: ({ type, id, nodeId, }: {
		type: HandleType;
		nodeId: string;
		id?: string | null;
	}) => HandleConnection[];
	/**
	 * Gets all connections to a node. Can be filtered by handle type and id.
	 * @param type - handle type 'source' or 'target'
	 * @param handleId - the handle id (this is only needed if you have multiple handles of the same type, meaning you have to provide a unique id for each handle)
	 * @param nodeId - the node id the handle belongs to
	 * @returns an array with handle connections
	 */
	getNodeConnections: ({ type, handleId, nodeId, }: {
		type?: HandleType;
		nodeId: string;
		handleId?: string | null;
	}) => NodeConnection[];
	/**
	 * Fits the view based on the passed params. By default it fits the view to all nodes.
	 *
	 * @param options.padding - optional padding
	 * @param options.nodes - optional nodes to fit the view to
	 * @param options.minZoom - optional minZoom
	 * @param options.maxZoom - optional maxZoom
	 * @param options.duration - optional duration. If set, a transition will be applied
	 * @param options.includeHiddenNodes - optional includeHiddenNodes
	 */
	fitView: FitView<NodeType>;
};
/**
 * The `ReactFlowInstance` provides a collection of methods to query and manipulate
 * the internal state of your flow. You can get an instance by using the
 * [`useReactFlow`](/api-reference/hooks/use-react-flow) hook or attaching a listener
 * to the [`onInit`](/api-reference/react-flow#event-oninit) event.
 *
 * @public
 */
export type ReactFlowInstance<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = GeneralHelpers<NodeType, EdgeType> & ViewportHelperFunctions & {
	/**
	 * React Flow needs to mount the viewport to the DOM and initialize its zoom and pan behavior.
	 * This property tells you when viewport is initialized.
	 */
	viewportInitialized: boolean;
};
/**
 * The `<ReactFlow />` component is the heart of your React Flow application.
 * It renders your nodes and edges and handles user interaction
 *
 * @public
 *
 * @example
 * ```tsx
 *import { ReactFlow } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (<ReactFlow
 *    nodes={...}
 *    edges={...}
 *    onNodesChange={...}
 *    ...
 *  />);
 *}
 *```
 */
declare const _default: <NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge>(props: ReactFlowProps<NodeType, EdgeType> & import("react").RefAttributes<HTMLDivElement>) => import("react").JSX.Element;
/**
 * @expand
 */
type HandleProps$1 = HandleProps & Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
	/** Callback called when connection is made */
	onConnect?: OnConnect;
};
/**
 * The `<Handle />` component is used in your [custom nodes](/learn/customization/custom-nodes)
 * to define connection points.
 *
 *@public
 *
 *@example
 *
 *```jsx
 *import { Handle, Position } from '@xyflow/react';
 *
 *export function CustomNode({ data }) {
 *  return (
 *    <>
 *      <div style={{ padding: '10px 20px' }}>
 *        {data.label}
 *      </div>
 *
 *      <Handle type="target" position={Position.Left} />
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *```
 */
declare const Handle$1: import("react").MemoExoticComponent<(props: HandleProps & Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
	/** Callback called when connection is made */
	onConnect?: OnConnect;
} & import("react").RefAttributes<HTMLDivElement>) => import("react").JSX.Element>;
declare function EdgeTextComponent({ x, y, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, children, className, ...rest }: EdgeTextProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace EdgeTextComponent {
	var displayName: string;
}
/**
 * You can use the `<EdgeText />` component as a helper component to display text
 * within your custom edges.
 *
 * @public
 *
 * @example
 * ```jsx
 * import { EdgeText } from '@xyflow/react';
 *
 * export function CustomEdgeLabel({ label }) {
 *   return (
 *     <EdgeText
 *       x={100}
 *       y={100}
 *       label={label}
 *       labelStyle={{ fill: 'white' }}
 *       labelShowBg
 *       labelBgStyle={{ fill: 'red' }}
 *       labelBgPadding={[2, 4]}
 *       labelBgBorderRadius={2}
 *     />
 *   );
 * }
 *```
 */
export declare const EdgeText: import("react").MemoExoticComponent<typeof EdgeTextComponent>;
/**
 * Component that can be used inside a custom edge to render a straight line.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { StraightEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY }) {
 *   return (
 *     <StraightEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *     />
 *   );
 * }
 * ```
 */
declare const StraightEdge$1: import("react").MemoExoticComponent<({ id, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }: StraightEdgeProps) => import("react/jsx-runtime").JSX.Element>;
/**
 * Component that can be used inside a custom edge to render a step edge.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { StepEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <StepEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *       sourcePosition={sourcePosition}
 *       targetPosition={targetPosition}
 *     />
 *   );
 * }
 * ```
 */
declare const StepEdge$1: import("react").MemoExoticComponent<({ id, ...props }: StepEdgeProps) => import("react/jsx-runtime").JSX.Element>;
/**
 * Component that can be used inside a custom edge to render a bezier curve.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { BezierEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <BezierEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *       sourcePosition={sourcePosition}
 *       targetPosition={targetPosition}
 *     />
 *   );
 * }
 * ```
 */
declare const BezierEdge$1: import("react").MemoExoticComponent<({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, pathOptions, interactionWidth, }: BezierEdgeProps) => import("react/jsx-runtime").JSX.Element>;
interface GetSimpleBezierPathParams {
	sourceX: number;
	sourceY: number;
	/** @default Position.Bottom */
	sourcePosition?: Position;
	targetX: number;
	targetY: number;
	/** @default Position.Top */
	targetPosition?: Position;
}
/**
 * The `getSimpleBezierPath` util returns everything you need to render a simple
 * bezier edge between two nodes.
 * @public
 * @returns
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 */
export declare function getSimpleBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, }: GetSimpleBezierPathParams): [
	path: string,
	labelX: number,
	labelY: number,
	offsetX: number,
	offsetY: number
];
export declare const SimpleBezierEdge: import("react").MemoExoticComponent<({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }: SimpleBezierEdgeProps) => import("react/jsx-runtime").JSX.Element>;
/**
 * Component that can be used inside a custom edge to render a smooth step edge.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { SmoothStepEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <SmoothStepEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *       sourcePosition={sourcePosition}
 *       targetPosition={targetPosition}
 *     />
 *   );
 * }
 * ```
 */
declare const SmoothStepEdge$1: import("react").MemoExoticComponent<({ id, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, sourcePosition, targetPosition, markerEnd, markerStart, pathOptions, interactionWidth, }: SmoothStepEdgeProps) => import("react/jsx-runtime").JSX.Element>;
/**
 * The `<BaseEdge />` component gets used internally for all the edges. It can be
 * used inside a custom edge and handles the invisible helper edge and the edge label
 * for you.
 *
 * @public
 * @example
 * ```jsx
 *import { BaseEdge } from '@xyflow/react';
 *
 *export function CustomEdge({ sourceX, sourceY, targetX, targetY, ...props }) {
 *  const [edgePath] = getStraightPath({
 *    sourceX,
 *    sourceY,
 *    targetX,
 *    targetY,
 *  });
 *
 *  return <BaseEdge path={edgePath} {...props} />;
 *}
 *```
 *
 * @remarks If you want to use an edge marker with the [`<BaseEdge />`](/api-reference/components/base-edge) component,
 * you can pass the `markerStart` or `markerEnd` props passed to your custom edge
 * through to the [`<BaseEdge />`](/api-reference/components/base-edge) component.
 * You can see all the props passed to a custom edge by looking at the [`EdgeProps`](/api-reference/types/edge-props) type.
 */
export declare function BaseEdge({ path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, interactionWidth, ...props }: BaseEdgeProps): import("react/jsx-runtime").JSX.Element;
type ReactFlowProviderProps = {
	/** These nodes are used to initialize the flow. They are not dynamic. */
	initialNodes?: Node$1[];
	/** These edges are used to initialize the flow. They are not dynamic. */
	initialEdges?: Edge[];
	/** These nodes are used to initialize the flow. They are not dynamic. */
	defaultNodes?: Node$1[];
	/** These edges are used to initialize the flow. They are not dynamic. */
	defaultEdges?: Edge[];
	/** The initial width is necessary to be able to use fitView on the server */
	initialWidth?: number;
	/** The initial height is necessary to be able to use fitView on the server */
	initialHeight?: number;
	/** When `true`, the flow will be zoomed and panned to fit all the nodes initially provided. */
	fitView?: boolean;
	/**
	 * You can provide an object of options to customize the initial fitView behavior.
	 */
	initialFitViewOptions?: FitViewOptions;
	/** Initial minimum zoom level */
	initialMinZoom?: number;
	/** Initial maximum zoom level */
	initialMaxZoom?: number;
	/**
	 * The origin of the node to use when placing it in the flow or looking up its `x` and `y`
	 * position. An origin of `[0, 0]` means that a node's top left corner will be placed at the `x`
	 * and `y` position.
	 * @default [0, 0]
	 * @example
	 * [0, 0] // default, top left
	 * [0.5, 0.5] // center
	 * [1, 1] // bottom right
	 */
	nodeOrigin?: NodeOrigin;
	/**
	 * By default, nodes can be placed on an infinite flow. You can use this prop to set a boundary.
	 *
	 * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
	 * @example [[-1000, -10000], [1000, 1000]]
	 */
	nodeExtent?: CoordinateExtent;
	children: ReactNode;
	zIndexMode?: ZIndexMode;
};
/**
 * The `<ReactFlowProvider />` component is a [context provider](https://react.dev/learn/passing-data-deeply-with-context#)
 * that makes it possible to access a flow's internal state outside of the
 * [`<ReactFlow />`](/api-reference/react-flow) component. Many of the hooks we
 * provide rely on this component to work.
 * @public
 *
 * @example
 * ```tsx
 *import { ReactFlow, ReactFlowProvider, useNodes } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlowProvider>
 *      <ReactFlow nodes={...} edges={...} />
 *      <Sidebar />
 *    </ReactFlowProvider>
 *  );
 *}
 *
 *function Sidebar() {
 *  // This hook will only work if the component it's used in is a child of a
 *  // <ReactFlowProvider />.
 *  const nodes = useNodes()
 *
 *  return <aside>do something with nodes</aside>;
 *}
 *```
 *
 * @remarks If you're using a router and want your flow's state to persist across routes,
 * it's vital that you place the `<ReactFlowProvider />` component _outside_ of
 * your router. If you have multiple flows on the same page you will need to use a separate
 * `<ReactFlowProvider />` for each flow.
 */
export declare function ReactFlowProvider({ initialNodes: nodes, initialEdges: edges, defaultNodes, defaultEdges, initialWidth: width, initialHeight: height, initialMinZoom: minZoom, initialMaxZoom: maxZoom, initialFitViewOptions: fitViewOptions, fitView, nodeOrigin, nodeExtent, zIndexMode, children, }: ReactFlowProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * @expand
 */
export type PanelProps = HTMLAttributes<HTMLDivElement> & {
	/**
	 * The position of the panel.
	 * @default "top-left"
	 */
	position?: PanelPosition;
};
/**
 * The `<Panel />` component helps you position content above the viewport.
 * It is used internally by the [`<MiniMap />`](/api-reference/components/minimap)
 * and [`<Controls />`](/api-reference/components/controls) components.
 *
 * @public
 *
 * @example
 * ```jsx
 *import { ReactFlow, Background, Panel } from '@xyflow/react';
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[]} fitView>
 *      <Panel position="top-left">top-left</Panel>
 *      <Panel position="top-center">top-center</Panel>
 *      <Panel position="top-right">top-right</Panel>
 *      <Panel position="bottom-left">bottom-left</Panel>
 *      <Panel position="bottom-center">bottom-center</Panel>
 *      <Panel position="bottom-right">bottom-right</Panel>
 *    </ReactFlow>
 *  );
 *}
 *```
 */
export declare const Panel: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
	/**
	 * The position of the panel.
	 * @default "top-left"
	 */
	position?: PanelPosition;
} & import("react").RefAttributes<HTMLDivElement>>;
export type EdgeLabelRendererProps = {
	children: ReactNode;
};
/**
 * Edges are SVG-based. If you want to render more complex labels you can use the
 * `<EdgeLabelRenderer />` component to access a div based renderer. This component
 * is a portal that renders the label in a `<div />` that is positioned on top of
 * the edges. You can see an example usage of the component in the
 * [edge label renderer example](/examples/edges/edge-label-renderer).
 * @public
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
 *
 * export function CustomEdge({ id, data, ...props }) {
 *   const [edgePath, labelX, labelY] = getBezierPath(props);
 *
 *   return (
 *     <>
 *       <BaseEdge id={id} path={edgePath} />
 *       <EdgeLabelRenderer>
 *         <div
 *           style={{
 *             position: 'absolute',
 *             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
 *             background: '#ffcc00',
 *             padding: 10,
 *         }}
 *           className="nodrag nopan"
 *         >
 *          {data.label}
 *         </div>
 *       </EdgeLabelRenderer>
 *     </>
 *   );
 * };
 * ```
 *
 * @remarks The `<EdgeLabelRenderer />` has no pointer events by default. If you want to
 * add mouse interactions you need to set the style `pointerEvents: all` and add
 * the `nopan` class on the label or the element you want to interact with.
 */
export declare function EdgeLabelRenderer({ children }: EdgeLabelRendererProps): import("react").ReactPortal | null;
/**
 * The `<ViewportPortal />` component can be used to add components to the same viewport
 * of the flow where nodes and edges are rendered. This is useful when you want to render
 * your own components that are adhere to the same coordinate system as the nodes & edges
 * and are also affected by zooming and panning
 * @public
 * @example
 *
 * ```jsx
 *import React from 'react';
 *import { ViewportPortal } from '@xyflow/react';
 *
 *export default function () {
 *  return (
 *    <ViewportPortal>
 *      <div
 *        style={{ transform: 'translate(100px, 100px)', position: 'absolute' }}
 *      >
 *        This div is positioned at [100, 100] on the flow.
 *      </div>
 *    </ViewportPortal>
 *  );
 *}
 *```
 */
export declare function ViewportPortal({ children }: {
	children: ReactNode;
}): import("react").ReactPortal | null;
/**
 * This hook returns a ReactFlowInstance that can be used to update nodes and edges, manipulate the viewport, or query the current state of the flow.
 *
 * @public
 * @example
 * ```jsx
 *import { useCallback, useState } from 'react';
 *import { useReactFlow } from '@xyflow/react';
 *
 *export function NodeCounter() {
 *  const reactFlow = useReactFlow();
 *  const [count, setCount] = useState(0);
 *  const countNodes = useCallback(() => {
 *    setCount(reactFlow.getNodes().length);
 *    // you need to pass it as a dependency if you are using it with useEffect or useCallback
 *    // because at the first render, it's not initialized yet and some functions might not work.
 *  }, [reactFlow]);
 *
 *  return (
 *    <div>
 *      <button onClick={countNodes}>Update count</button>
 *      <p>There are {count} nodes in the flow.</p>
 *    </div>
 *  );
 *}
 *```
 */
export declare function useReactFlow<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge>(): ReactFlowInstance<NodeType, EdgeType>;
/**
 * When you programmatically add or remove handles to a node or update a node's
 * handle position, you need to let React Flow know about it using this hook. This
 * will update the internal dimensions of the node and properly reposition handles
 * on the canvas if necessary.
 *
 * @public
 * @returns Use this function to tell React Flow to update the internal state of one or more nodes
 * that you have changed programmatically.
 *
 * @example
 * ```jsx
 *import { useCallback, useState } from 'react';
 *import { Handle, useUpdateNodeInternals } from '@xyflow/react';
 *
 *export default function RandomHandleNode({ id }) {
 *  const updateNodeInternals = useUpdateNodeInternals();
 *  const [handleCount, setHandleCount] = useState(0);
 *  const randomizeHandleCount = useCallback(() => {
 *   setHandleCount(Math.floor(Math.random() * 10));
 *    updateNodeInternals(id);
 *  }, [id, updateNodeInternals]);
 *
 *  return (
 *    <>
 *      {Array.from({ length: handleCount }).map((_, index) => (
 *        <Handle
 *          key={index}
 *          type="target"
 *          position="left"
 *          id={`handle-${index}`}
 *        />
 *      ))}
 *
 *      <div>
 *        <button onClick={randomizeHandleCount}>Randomize handle count</button>
 *        <p>There are {handleCount} handles on this node.</p>
 *      </div>
 *    </>
 *  );
 *}
 *```
 * @remarks This hook can only be used in a component that is a child of a
 *{@link ReactFlowProvider} or a {@link ReactFlow} component.
 */
export declare function useUpdateNodeInternals(): UpdateNodeInternals;
/**
 * This hook returns an array of the current nodes. Components that use this hook
 * will re-render **whenever any node changes**, including when a node is selected
 * or moved.
 *
 * @public
 * @returns An array of all nodes currently in the flow.
 *
 * @example
 * ```jsx
 *import { useNodes } from '@xyflow/react';
 *
 *export default function() {
 *  const nodes = useNodes();
 *
 *  return <div>There are currently {nodes.length} nodes!</div>;
 *}
 *```
 */
export declare function useNodes<NodeType extends Node$1 = Node$1>(): NodeType[];
/**
 * This hook returns an array of the current edges. Components that use this hook
 * will re-render **whenever any edge changes**.
 *
 * @public
 * @returns An array of all edges currently in the flow.
 *
 * @example
 * ```tsx
 *import { useEdges } from '@xyflow/react';
 *
 *export default function () {
 *  const edges = useEdges();
 *
 *  return <div>There are currently {edges.length} edges!</div>;
 *}
 *```
 */
export declare function useEdges<EdgeType extends Edge = Edge>(): EdgeType[];
/**
 * The `useViewport` hook is a convenient way to read the current state of the
 * {@link Viewport} in a component. Components that use this hook
 * will re-render **whenever the viewport changes**.
 *
 * @public
 * @returns The current viewport.
 *
 * @example
 *
 *```jsx
 *import { useViewport } from '@xyflow/react';
 *
 *export default function ViewportDisplay() {
 *  const { x, y, zoom } = useViewport();
 *
 *  return (
 *    <div>
 *      <p>
 *        The viewport is currently at ({x}, {y}) and zoomed to {zoom}.
 *      </p>
 *    </div>
 *  );
 *}
 *```
 *
 * @remarks This hook can only be used in a component that is a child of a
 *{@link ReactFlowProvider} or a {@link ReactFlow} component.
 */
export declare function useViewport(): Viewport;
type UseKeyPressOptions = {
	/**
	 * Listen to key presses on a specific element.
	 * @default document
	 */
	target?: Window | Document | HTMLElement | ShadowRoot | null;
	/**
	 * You can use this flag to prevent triggering the key press hook when an input field is focused.
	 * @default true
	 */
	actInsideInputWithModifier?: boolean;
	preventDefault?: boolean;
};
/**
 * This hook lets you listen for specific key codes and tells you whether they are
 * currently pressed or not.
 *
 * @public
 * @param options - Options
 *
 * @example
 * ```tsx
 *import { useKeyPress } from '@xyflow/react';
 *
 *export default function () {
 *  const spacePressed = useKeyPress('Space');
 *  const cmdAndSPressed = useKeyPress(['Meta+s', 'Strg+s']);
 *
 *  return (
 *    <div>
 *     {spacePressed && <p>Space pressed!</p>}
 *     {cmdAndSPressed && <p>Cmd + S pressed!</p>}
 *    </div>
 *  );
 *}
 *```
 */
export declare function useKeyPress(
/**
 * The key code (string or array of strings) specifies which key(s) should trigger
 * an action.
 *
 * A **string** can represent:
 * - A **single key**, e.g. `'a'`
 * - A **key combination**, using `'+'` to separate keys, e.g. `'a+d'`
 *
 * An  **array of strings** represents **multiple possible key inputs**. For example, `['a', 'd+s']`
 * means the user can press either the single key `'a'` or the combination of `'d'` and `'s'`.
 * @default null
 */
keyCode?: KeyCode | null, options?: UseKeyPressOptions): boolean;
/**
 * This hook makes it easy to prototype a controlled flow where you manage the
 * state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 * like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @returns
 * - `nodes`: The current array of nodes. You might pass this directly to the `nodes` prop of your
 * `<ReactFlow />` component, or you may want to manipulate it first to perform some layouting,
 * for example.
 * - `setNodes`: A function that you can use to update the nodes. You can pass it a new array of
 * nodes or a callback that receives the current array of nodes and returns a new array of nodes.
 * This is the same as the second element of the tuple returned by React's `useState` hook.
 * - `onNodesChange`: A handy callback that can take an array of `NodeChanges` and update the nodes
 * state accordingly. You'll typically pass this directly to the `onNodesChange` prop of your
 * `<ReactFlow />` component.
 * @example
 *
 *```tsx
 *import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
 *
 *const initialNodes = [];
 *const initialEdges = [];
 *
 *export default function () {
 *  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 *  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 *
 *  return (
 *    <ReactFlow
 *      nodes={nodes}
 *      edges={edges}
 *      onNodesChange={onNodesChange}
 *      onEdgesChange={onEdgesChange}
 *    />
 *  );
 *}
 *```
 *
 * @remarks This hook was created to make prototyping easier and our documentation
 * examples clearer. Although it is OK to use this hook in production, in
 * practice you may want to use a more sophisticated state management solution
 * like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
 */
export declare function useNodesState<NodeType extends Node$1>(initialNodes: NodeType[]): [
	nodes: NodeType[],
	setNodes: Dispatch<SetStateAction<NodeType[]>>,
	onNodesChange: OnNodesChange<NodeType>
];
/**
 * This hook makes it easy to prototype a controlled flow where you manage the
 * state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 * like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @returns
 * - `edges`: The current array of edges. You might pass this directly to the `edges` prop of your
 * `<ReactFlow />` component, or you may want to manipulate it first to perform some layouting,
 * for example.
 *
 * - `setEdges`: A function that you can use to update the edges. You can pass it a new array of
 * edges or a callback that receives the current array of edges and returns a new array of edges.
 * This is the same as the second element of the tuple returned by React's `useState` hook.
 *
 * - `onEdgesChange`: A handy callback that can take an array of `EdgeChanges` and update the edges
 * state accordingly. You'll typically pass this directly to the `onEdgesChange` prop of your
 * `<ReactFlow />` component.
 * @example
 *
 *```tsx
 *import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
 *
 *const initialNodes = [];
 *const initialEdges = [];
 *
 *export default function () {
 *  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 *  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 *
 *  return (
 *    <ReactFlow
 *      nodes={nodes}
 *      edges={edges}
 *      onNodesChange={onNodesChange}
 *      onEdgesChange={onEdgesChange}
 *    />
 *  );
 *}
 *```
 *
 * @remarks This hook was created to make prototyping easier and our documentation
 * examples clearer. Although it is OK to use this hook in production, in
 * practice you may want to use a more sophisticated state management solution
 * like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
 */
export declare function useEdgesState<EdgeType extends Edge = Edge>(initialEdges: EdgeType[]): [
	edges: EdgeType[],
	setEdges: Dispatch<SetStateAction<EdgeType[]>>,
	onEdgesChange: OnEdgesChange<EdgeType>
];
/**
 * This hook can be used to subscribe to internal state changes of the React Flow
 * component. The `useStore` hook is re-exported from the [Zustand](https://github.com/pmndrs/zustand)
 * state management library, so you should check out their docs for more details.
 *
 * @public
 * @param selector - A selector function that returns a slice of the flow's internal state.
 * Extracting or transforming just the state you need is a good practice to avoid unnecessary
 * re-renders.
 * @param equalityFn - A function to compare the previous and next value. This is incredibly useful
 * for preventing unnecessary re-renders. Good sensible defaults are using `Object.is` or importing
 * `zustand/shallow`, but you can be as granular as you like.
 * @returns The selected state slice.
 *
 * @example
 * ```ts
 * const nodes = useStore((state) => state.nodes);
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
export declare function useStore<StateSlice = unknown>(selector: (state: ReactFlowState) => StateSlice, equalityFn?: (a: StateSlice, b: StateSlice) => boolean): StateSlice;
/**
 * In some cases, you might need to access the store directly. This hook returns the store object which can be used on demand to access the state or dispatch actions.
 *
 * @returns The store object.
 * @example
 * ```ts
 * const store = useStoreApi();
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
export declare function useStoreApi<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge>(): {
	getState: () => ReactFlowState<NodeType, EdgeType>;
	setState: (partial: ReactFlowState<NodeType, EdgeType> | Partial<ReactFlowState<NodeType, EdgeType>> | ((state: ReactFlowState<NodeType, EdgeType>) => ReactFlowState<NodeType, EdgeType> | Partial<ReactFlowState<NodeType, EdgeType>>), replace?: boolean | undefined) => void;
	subscribe: (listener: (state: ReactFlowState<NodeType, EdgeType>, prevState: ReactFlowState<NodeType, EdgeType>) => void) => () => void;
};
export type UseOnViewportChangeOptions = {
	/** Gets called when the viewport starts changing. */
	onStart?: OnViewportChange;
	/** Gets called when the viewport changes. */
	onChange?: OnViewportChange;
	/** Gets called when the viewport stops changing. */
	onEnd?: OnViewportChange;
};
/**
 * The `useOnViewportChange` hook lets you listen for changes to the viewport such
 * as panning and zooming. You can provide a callback for each phase of a viewport
 * change: `onStart`, `onChange`, and `onEnd`.
 *
 * @public
 * @example
 * ```jsx
 *import { useCallback } from 'react';
 *import { useOnViewportChange } from '@xyflow/react';
 *
 *function ViewportChangeLogger() {
 *  useOnViewportChange({
 *    onStart: (viewport: Viewport) => console.log('start', viewport),
 *    onChange: (viewport: Viewport) => console.log('change', viewport),
 *    onEnd: (viewport: Viewport) => console.log('end', viewport),
 *  });
 *
 *  return null;
 *}
 *```
 */
export declare function useOnViewportChange({ onStart, onChange, onEnd }: UseOnViewportChangeOptions): void;
export type UseOnSelectionChangeOptions<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge> = {
	/** The handler to register. */
	onChange: OnSelectionChangeFunc<NodeType, EdgeType>;
};
/**
 * This hook lets you listen for changes to both node and edge selection. As the
 *name implies, the callback you provide will be called whenever the selection of
 *_either_ nodes or edges changes.
 *
 * @public
 * @example
 * ```jsx
 *import { useState } from 'react';
 *import { ReactFlow, useOnSelectionChange } from '@xyflow/react';
 *
 *function SelectionDisplay() {
 *  const [selectedNodes, setSelectedNodes] = useState([]);
 *  const [selectedEdges, setSelectedEdges] = useState([]);
 *
 *  // the passed handler has to be memoized, otherwise the hook will not work correctly
 *  const onChange = useCallback(({ nodes, edges }) => {
 *    setSelectedNodes(nodes.map((node) => node.id));
 *    setSelectedEdges(edges.map((edge) => edge.id));
 *  }, []);
 *
 *  useOnSelectionChange({
 *    onChange,
 *  });
 *
 *  return (
 *    <div>
 *      <p>Selected nodes: {selectedNodes.join(', ')}</p>
 *      <p>Selected edges: {selectedEdges.join(', ')}</p>
 *    </div>
 *  );
 *}
 *```
 *
 * @remarks You need to memoize the passed `onChange` handler, otherwise the hook will not work correctly.
 */
export declare function useOnSelectionChange<NodeType extends Node$1 = Node$1, EdgeType extends Edge = Edge>({ onChange, }: UseOnSelectionChangeOptions<NodeType, EdgeType>): void;
export type UseNodesInitializedOptions = {
	/** @default false */
	includeHiddenNodes?: boolean;
};
/**
 * This hook tells you whether all the nodes in a flow have been measured and given
 *a width and height. When you add a node to the flow, this hook will return
 *`false` and then `true` again once the node has been measured.
 *
 * @public
 * @returns Whether or not the nodes have been initialized by the `<ReactFlow />` component and
 * given a width and height.
 *
 * @example
 * ```jsx
 *import { useReactFlow, useNodesInitialized } from '@xyflow/react';
 *import { useEffect, useState } from 'react';
 *
 *const options = {
 *  includeHiddenNodes: false,
 *};
 *
 *export default function useLayout() {
 *  const { getNodes } = useReactFlow();
 *  const nodesInitialized = useNodesInitialized(options);
 *  const [layoutedNodes, setLayoutedNodes] = useState(getNodes());
 *
 *  useEffect(() => {
 *    if (nodesInitialized) {
 *      setLayoutedNodes(yourLayoutingFunction(getNodes()));
 *    }
 *  }, [nodesInitialized]);
 *
 *  return layoutedNodes;
 *}
 *```
 */
export declare function useNodesInitialized(options?: UseNodesInitializedOptions): boolean;
type UseHandleConnectionsParams = {
	/** What type of handle connections do you want to observe? */
	type: HandleType;
	/** The handle id (this is only needed if the node has multiple handles of the same type). */
	id?: string | null;
	/** If node id is not provided, the node id from the `NodeIdContext` is used. */
	nodeId?: string;
	/** Gets called when a connection is established. */
	onConnect?: (connections: Connection[]) => void;
	/** Gets called when a connection is removed. */
	onDisconnect?: (connections: Connection[]) => void;
};
/**
 * Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @deprecated Use `useNodeConnections` instead.
 * @returns An array with handle connections.
 */
export declare function useHandleConnections({ type, id, nodeId, onConnect, onDisconnect, }: UseHandleConnectionsParams): HandleConnection[];
/**
 * This hook returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.
 *
 * @public
 * @returns An array with connections.
 *
 * @example
 * ```jsx
 *import { useNodeConnections } from '@xyflow/react';
 *
 *export default function () {
 *  const connections = useNodeConnections({
 *    handleType: 'target',
 *    handleId: 'my-handle',
 *  });
 *
 *  return (
 *    <div>There are currently {connections.length} incoming connections!</div>
 *  );
 *}
 *```
 */
export declare function useNodeConnections({ id, handleType, handleId, onConnect, onDisconnect, }?: UseNodeConnectionsParams): NodeConnection[];
/**
 * This hook lets you subscribe to changes of a specific nodes `data` object.
 *
 * @public
 * @returns An object (or array of object) with `id`, `type`, `data` representing each node.
 *
 * @example
 *```jsx
 *import { useNodesData } from '@xyflow/react';
 *
 *export default function() {
 *  const nodeData = useNodesData('nodeId-1');
 *  const nodesData = useNodesData(['nodeId-1', 'nodeId-2']);
 *
 *  return null;
 *}
 *```
 */
export declare function useNodesData<NodeType extends Node$1 = Node$1>(
/** The id of the node to get the data from. */
nodeId: string): DistributivePick<NodeType, "id" | "type" | "data"> | null;
export declare function useNodesData<NodeType extends Node$1 = Node$1>(
/** The ids of the nodes to get the data from. */
nodeIds: string[]): DistributivePick<NodeType, "id" | "type" | "data">[];
/**
 * The `useConnection` hook returns the current connection when there is an active
 * connection interaction. If no connection interaction is active, it returns null
 * for every property. A typical use case for this hook is to colorize handles
 * based on a certain condition (e.g. if the connection is valid or not).
 *
 * @public
 * @param connectionSelector - An optional selector function used to extract a slice of the
 * `ConnectionState` data. Using a selector can prevent component re-renders where data you don't
 * otherwise care about might change. If a selector is not provided, the entire `ConnectionState`
 * object is returned unchanged.
 * @example
 *
 * ```tsx
 *import { useConnection } from '@xyflow/react';
 *
 *function App() {
 *  const connection = useConnection();
 *
 *  return (
 *    <div> {connection ? `Someone is trying to make a connection from ${connection.fromNode} to this one.` : 'There are currently no incoming connections!'}
 *
 *   </div>
 *   );
 * }
 * ```
 *
 * @returns ConnectionState
 */
export declare function useConnection<NodeType extends Node$1 = Node$1, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn): SelectorReturn;
/**
 * This hook returns the internal representation of a specific node.
 * Components that use this hook will re-render **whenever the node changes**,
 * including when a node is selected or moved.
 *
 * @public
 * @param id - The ID of a node you want to observe.
 * @returns The `InternalNode` object for the node with the given ID.
 *
 * @example
 * ```tsx
 *import { useInternalNode } from '@xyflow/react';
 *
 *export default function () {
 *  const internalNode = useInternalNode('node-1');
 *  const absolutePosition = internalNode.internals.positionAbsolute;
 *
 *  return (
 *    <div>
 *      The absolute position of the node is at:
 *      <p>x: {absolutePosition.x}</p>
 *      <p>y: {absolutePosition.y}</p>
 *    </div>
 *  );
 *}
 *```
 */
export declare function useInternalNode<NodeType extends Node$1 = Node$1>(id: string): InternalNode<NodeType> | undefined;
/**
 * You can use this hook to get the id of the node it is used inside. It is useful
 * if you need the node's id deeper in the render tree but don't want to manually
 * drill down the id as a prop.
 *
 * @public
 * @returns The id for a node in the flow.
 *
 * @example
 *```jsx
 *import { useNodeId } from '@xyflow/react';
 *
 *export default function CustomNode() {
 *  return (
 *    <div>
 *      <span>This node has an id of </span>
 *      <NodeIdDisplay />
 *    </div>
 *  );
 *}
 *
 *function NodeIdDisplay() {
 *  const nodeId = useNodeId();
 *
 *  return <span>{nodeId}</span>;
 *}
 *```
 */
export declare const useNodeId: () => string | null;
/**
 * Registers a middleware function to transform node changes.
 *
 * @public
 * @param fn - Middleware function. Should be memoized with useCallback to avoid re-registration.
 */
export declare function experimental_useOnNodesChangeMiddleware<NodeType extends Node$1 = Node$1>(fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]): void;
/**
 * Registers a middleware function to transform edge changes.
 *
 * @public
 * @param fn - Middleware function. Should be memoized with useCallback to avoid re-registration.
 */
export declare function experimental_useOnEdgesChangeMiddleware<EdgeType extends Edge = Edge>(fn: (changes: EdgeChange<EdgeType>[]) => EdgeChange<EdgeType>[]): void;
/**
 * Drop in function that applies node changes to an array of nodes.
 * @public
 * @param changes - Array of changes to apply.
 * @param nodes - Array of nodes to apply the changes to.
 * @returns Array of updated nodes.
 * @example
 *```tsx
 *import { useState, useCallback } from 'react';
 *import { ReactFlow, applyNodeChanges, type Node, type Edge, type OnNodesChange } from '@xyflow/react';
 *
 *export default function Flow() {
 *  const [nodes, setNodes] = useState<Node[]>([]);
 *  const [edges, setEdges] = useState<Edge[]>([]);
 *  const onNodesChange: OnNodesChange = useCallback(
 *    (changes) => {
 *      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
 *    },
 *    [setNodes],
 *  );
 *
 *  return (
 *    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
 *  );
 *}
 *```
 * @remarks Various events on the <ReactFlow /> component can produce an {@link NodeChange}
 * that describes how to update the edges of your flow in some way.
 * If you don't need any custom behaviour, this util can be used to take an array
 * of these changes and apply them to your edges.
 */
export declare function applyNodeChanges<NodeType extends Node$1 = Node$1>(changes: NodeChange<NodeType>[], nodes: NodeType[]): NodeType[];
/**
 * Drop in function that applies edge changes to an array of edges.
 * @public
 * @param changes - Array of changes to apply.
 * @param edges - Array of edge to apply the changes to.
 * @returns Array of updated edges.
 * @example
 * ```tsx
 *import { useState, useCallback } from 'react';
 *import { ReactFlow, applyEdgeChanges } from '@xyflow/react';
 *
 *export default function Flow() {
 *  const [nodes, setNodes] = useState([]);
 *  const [edges, setEdges] = useState([]);
 *  const onEdgesChange = useCallback(
 *    (changes) => {
 *      setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
 *    },
 *    [setEdges],
 *  );
 *
 *  return (
 *    <ReactFlow nodes={nodes} edges={edges} onEdgesChange={onEdgesChange} />
 *  );
 *}
 *```
 * @remarks Various events on the <ReactFlow /> component can produce an {@link EdgeChange}
 * that describes how to update the edges of your flow in some way.
 * If you don't need any custom behaviour, this util can be used to take an array
 * of these changes and apply them to your edges.
 */
export declare function applyEdgeChanges<EdgeType extends Edge = Edge>(changes: EdgeChange<EdgeType>[], edges: EdgeType[]): EdgeType[];
/**
 * Test whether an object is usable as an [`Node`](/api-reference/types/node).
 * In TypeScript this is a type guard that will narrow the type of whatever you pass in to
 * [`Node`](/api-reference/types/node) if it returns `true`.
 *
 * @public
 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Node if it returns true
 * @param element - The element to test.
 * @returns Tests whether the provided value can be used as a `Node`. If you're using TypeScript,
 * this function acts as a type guard and will narrow the type of the value to `Node` if it returns
 * `true`.
 *
 * @example
 * ```js
 *import { isNode } from '@xyflow/react';
 *
 *if (isNode(node)) {
 * // ...
 *}
 *```
 */
export declare const isNode: <NodeType extends Node$1 = Node$1>(element: unknown) => element is NodeType;
/**
 * Test whether an object is usable as an [`Edge`](/api-reference/types/edge).
 * In TypeScript this is a type guard that will narrow the type of whatever you pass in to
 * [`Edge`](/api-reference/types/edge) if it returns `true`.
 *
 * @public
 * @remarks In TypeScript this is a type guard that will narrow the type of whatever you pass in to Edge if it returns true
 * @param element - The element to test
 * @returns Tests whether the provided value can be used as an `Edge`. If you're using TypeScript,
 * this function acts as a type guard and will narrow the type of the value to `Edge` if it returns
 * `true`.
 *
 * @example
 * ```js
 *import { isEdge } from '@xyflow/react';
 *
 *if (isEdge(edge)) {
 * // ...
 *}
 *```
 */
export declare const isEdge: <EdgeType extends Edge = Edge>(element: unknown) => element is EdgeType;
/**
 * The three variants are exported as an enum for convenience. You can either import
 * the enum and use it like `BackgroundVariant.Lines` or you can use the raw string
 * value directly.
 * @public
 */
export declare enum BackgroundVariant {
	Lines = "lines",
	Dots = "dots",
	Cross = "cross"
}
/**
 * @expand
 */
export type BackgroundProps = {
	/** When multiple backgrounds are present on the page, each one should have a unique id. */
	id?: string;
	/** Color of the pattern. */
	color?: string;
	/** Color of the background. */
	bgColor?: string;
	/** Class applied to the container. */
	className?: string;
	/** Class applied to the pattern. */
	patternClassName?: string;
	/**
	 * The gap between patterns. Passing in a tuple allows you to control the x and y gap
	 * independently.
	 * @default 20
	 */
	gap?: number | [
		number,
		number
	];
	/**
	 * The radius of each dot or the size of each rectangle if `BackgroundVariant.Dots` or
	 * `BackgroundVariant.Cross` is used. This defaults to 1 or 6 respectively, or ignored if
	 * `BackgroundVariant.Lines` is used.
	 */
	size?: number;
	/**
	 * Offset of the pattern.
	 * @default 0
	 */
	offset?: number | [
		number,
		number
	];
	/**
	 * The stroke thickness used when drawing the pattern.
	 * @default 1
	 */
	lineWidth?: number;
	/**
	 * Variant of the pattern.
	 * @default BackgroundVariant.Dots
	 * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
	 * 'lines', 'dots', 'cross'
	 */
	variant?: BackgroundVariant;
	/** Style applied to the container. */
	style?: CSSProperties;
};
declare function BackgroundComponent({ id, variant, gap, size, lineWidth, offset, color, bgColor, style, className, patternClassName, }: BackgroundProps): import("react/jsx-runtime").JSX.Element;
declare namespace BackgroundComponent {
	var displayName: string;
}
/**
 * The `<Background />` component makes it convenient to render different types of backgrounds common in node-based UIs. It comes with three variants: lines, dots and cross.
 *
 * @example
 *
 * A simple example of how to use the Background component.
 *
 * ```tsx
 * import { useState } from 'react';
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background color="#ccc" variant={BackgroundVariant.Dots} />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @example
 *
 * In this example you can see how to combine multiple backgrounds
 *
 * ```tsx
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
 * import '@xyflow/react/dist/style.css';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background
 *         id="1"
 *         gap={10}
 *         color="#f1f1f1"
 *         variant={BackgroundVariant.Lines}
 *       />
 *       <Background
 *         id="2"
 *         gap={100}
 *         color="#ccc"
 *         variant={BackgroundVariant.Lines}
 *       />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @remarks
 *
 * When combining multiple <Background /> components it’s important to give each of them a unique id prop!
 *
 */
export declare const Background: import("react").MemoExoticComponent<typeof BackgroundComponent>;
/**
 * @expand
 */
export type ControlProps = {
	/**
	 * Whether or not to show the zoom in and zoom out buttons. These buttons will adjust the viewport
	 * zoom by a fixed amount each press.
	 * @default true
	 */
	showZoom?: boolean;
	/**
	 * Whether or not to show the fit view button. By default, this button will adjust the viewport so
	 * that all nodes are visible at once.
	 * @default true
	 */
	showFitView?: boolean;
	/**
	 * Show button for toggling interactivity
	 * @default true
	 */
	showInteractive?: boolean;
	/**
	 * Customise the options for the fit view button. These are the same options you would pass to the
	 * fitView function.
	 */
	fitViewOptions?: FitViewOptions;
	/** Called in addition the default zoom behavior when the zoom in button is clicked. */
	onZoomIn?: () => void;
	/** Called in addition the default zoom behavior when the zoom out button is clicked. */
	onZoomOut?: () => void;
	/**
	 * Called when the fit view button is clicked. When this is not provided, the viewport will be
	 * adjusted so that all nodes are visible.
	 */
	onFitView?: () => void;
	/** Called when the interactive (lock) button is clicked. */
	onInteractiveChange?: (interactiveStatus: boolean) => void;
	/**
	 * Position of the controls on the pane
	 * @default PanelPosition.BottomLeft
	 * @example PanelPosition.TopLeft, PanelPosition.TopRight,
	 * PanelPosition.BottomLeft, PanelPosition.BottomRight
	 */
	position?: PanelPosition;
	children?: ReactNode;
	/** Style applied to container */
	style?: CSSProperties;
	/** Class name applied to container */
	className?: string;
	/**
	 * @default 'React Flow controls'
	 */
	"aria-label"?: string;
	/**
	 * @default 'vertical'
	 */
	orientation?: "horizontal" | "vertical";
};
/**
 * @expand
 */
export type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
declare function ControlsComponent({ style, showZoom, showFitView, showInteractive, fitViewOptions, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, children, position, orientation, "aria-label": ariaLabel, }: ControlProps): import("react/jsx-runtime").JSX.Element;
declare namespace ControlsComponent {
	var displayName: string;
}
/**
 * The `<Controls />` component renders a small panel that contains convenient
 * buttons to zoom in, zoom out, fit the view, and lock the viewport.
 *
 * @public
 * @example
 *```tsx
 *import { ReactFlow, Controls } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls />
 *    </ReactFlow>
 *  )
 *}
 *```
 *
 * @remarks To extend or customise the controls, you can use the [`<ControlButton />`](/api-reference/components/control-button) component
 *
 */
export declare const Controls: import("react").MemoExoticComponent<typeof ControlsComponent>;
/**
 * You can add buttons to the control panel by using the `<ControlButton />` component
 * and pass it as a child to the [`<Controls />`](/api-reference/components/controls) component.
 *
 * @public
 * @example
 *```jsx
 *import { MagicWand } from '@radix-ui/react-icons'
 *import { ReactFlow, Controls, ControlButton } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls>
 *        <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
 *          <MagicWand />
 *        </ControlButton>
 *      </Controls>
 *    </ReactFlow>
 *  )
 *}
 *```
 */
export declare function ControlButton({ children, className, ...rest }: ControlButtonProps): import("react/jsx-runtime").JSX.Element;
export type GetMiniMapNodeAttribute<NodeType extends Node$1 = Node$1> = (node: NodeType) => string;
/**
 * @expand
 */
export type MiniMapProps<NodeType extends Node$1 = Node$1> = Omit<HTMLAttributes<SVGSVGElement>, "onClick"> & {
	/**
	 * Color of nodes on minimap.
	 * @default "#e2e2e2"
	 */
	nodeColor?: string | GetMiniMapNodeAttribute<NodeType>;
	/**
	 * Stroke color of nodes on minimap.
	 * @default "transparent"
	 */
	nodeStrokeColor?: string | GetMiniMapNodeAttribute<NodeType>;
	/**
	 * Class name applied to nodes on minimap.
	 * @default ""
	 */
	nodeClassName?: string | GetMiniMapNodeAttribute<NodeType>;
	/**
	 * Border radius of nodes on minimap.
	 * @default 5
	 */
	nodeBorderRadius?: number;
	/**
	 * Stroke width of nodes on minimap.
	 * @default 2
	 */
	nodeStrokeWidth?: number;
	/**
	 * A custom component to render the nodes in the minimap. This component must render an SVG
	 * element!
	 */
	nodeComponent?: ComponentType<MiniMapNodeProps>;
	/** Background color of minimap. */
	bgColor?: string;
	/**
	 * The color of the mask that covers the portion of the minimap not currently visible in the
	 * viewport.
	 * @default "rgba(240, 240, 240, 0.6)"
	 */
	maskColor?: string;
	/**
	 * Stroke color of mask representing viewport.
	 * @default transparent
	 */
	maskStrokeColor?: string;
	/**
	 * Stroke width of mask representing viewport.
	 * @default 1
	 */
	maskStrokeWidth?: number;
	/**
	 * Position of minimap on pane.
	 * @default PanelPosition.BottomRight
	 * @example PanelPosition.TopLeft, PanelPosition.TopRight,
	 * PanelPosition.BottomLeft, PanelPosition.BottomRight
	 */
	position?: PanelPosition;
	/** Callback called when minimap is clicked. */
	onClick?: (event: MouseEvent, position: XYPosition) => void;
	/** Callback called when node on minimap is clicked. */
	onNodeClick?: (event: MouseEvent, node: NodeType) => void;
	/**
	 * Determines whether you can pan the viewport by dragging inside the minimap.
	 * @default false
	 */
	pannable?: boolean;
	/**
	 * Determines whether you can zoom the viewport by scrolling inside the minimap.
	 * @default false
	 */
	zoomable?: boolean;
	/**
	 * There is no text inside the minimap for a screen reader to use as an accessible name, so it's
	 * important we provide one to make the minimap accessible. The default is sufficient, but you may
	 * want to replace it with something more relevant to your app or product.
	 * @default "Mini Map"
	 */
	ariaLabel?: string | null;
	/** Invert direction when panning the minimap viewport. */
	inversePan?: boolean;
	/**
	 * Step size for zooming in/out on minimap.
	 * @default 10
	 */
	zoomStep?: number;
	/**
	 * Offset the viewport on the minimap, acts like a padding.
	 * @default 5
	 */
	offsetScale?: number;
};
export type MiniMapNodes<NodeType extends Node$1 = Node$1> = Pick<MiniMapProps<NodeType>, "nodeColor" | "nodeStrokeColor" | "nodeClassName" | "nodeBorderRadius" | "nodeStrokeWidth" | "nodeComponent"> & {
	onClick?: (event: MouseEvent, nodeId: string) => void;
};
/**
 * The props that are passed to the MiniMapNode component
 *
 * @public
 * @expand
 */
export type MiniMapNodeProps = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	borderRadius: number;
	className: string;
	color?: string;
	shapeRendering: string;
	strokeColor?: string;
	strokeWidth?: number;
	style?: CSSProperties;
	selected: boolean;
	onClick?: (event: MouseEvent, id: string) => void;
};
declare function MiniMapComponent<NodeType extends Node$1 = Node$1>({ style, className, nodeStrokeColor, nodeColor, nodeClassName, nodeBorderRadius, nodeStrokeWidth, nodeComponent, bgColor, maskColor, maskStrokeColor, maskStrokeWidth, position, onClick, onNodeClick, pannable, zoomable, ariaLabel, inversePan, zoomStep, offsetScale, }: MiniMapProps<NodeType>): import("react/jsx-runtime").JSX.Element;
declare namespace MiniMapComponent {
	var displayName: string;
}
/**
 * The `<MiniMap />` component can be used to render an overview of your flow. It
 * renders each node as an SVG element and visualizes where the current viewport is
 * in relation to the rest of the flow.
 *
 * @public
 * @example
 *
 * ```jsx
 *import { ReactFlow, MiniMap } from '@xyflow/react';
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <MiniMap nodeStrokeWidth={3} />
 *    </ReactFlow>
 *  );
 *}
 *```
 */
export declare const MiniMap: typeof MiniMapComponent;
declare function MiniMapNodeComponent({ id, x, y, width, height, style, color, strokeColor, strokeWidth, className, borderRadius, shapeRendering, selected, onClick, }: MiniMapNodeProps): import("react/jsx-runtime").JSX.Element;
export declare const MiniMapNode: import("react").MemoExoticComponent<typeof MiniMapNodeComponent>;
/**
 * @expand
 */
export type NodeResizerProps = {
	/**
	 * Id of the node it is resizing.
	 * @remarks optional if used inside custom node
	 */
	nodeId?: string;
	/** Color of the resize handle. */
	color?: string;
	/** Class name applied to handle. */
	handleClassName?: string;
	/** Style applied to handle. */
	handleStyle?: CSSProperties;
	/** Class name applied to line. */
	lineClassName?: string;
	/** Style applied to line. */
	lineStyle?: CSSProperties;
	/**
	 * Are the controls visible.
	 * @default true
	 */
	isVisible?: boolean;
	/**
	 * Minimum width of node.
	 * @default 10
	 */
	minWidth?: number;
	/**
	 * Minimum height of node.
	 * @default 10
	 */
	minHeight?: number;
	/**
	 * Maximum width of node.
	 * @default Number.MAX_VALUE
	 */
	maxWidth?: number;
	/**
	 * Maximum height of node.
	 * @default Number.MAX_VALUE
	 */
	maxHeight?: number;
	/**
	 * Keep aspect ratio when resizing.
	 * @default false
	 */
	keepAspectRatio?: boolean;
	/**
	 * Scale the controls with the zoom level.
	 * @default true
	 */
	autoScale?: boolean;
	/** Callback to determine if node should resize. */
	shouldResize?: ShouldResize;
	/** Callback called when resizing starts. */
	onResizeStart?: OnResizeStart;
	/** Callback called when resizing. */
	onResize?: OnResize;
	/** Callback called when resizing ends. */
	onResizeEnd?: OnResizeEnd;
};
/**
 * @expand
 */
export type ResizeControlProps = Pick<NodeResizerProps, "nodeId" | "color" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "keepAspectRatio" | "shouldResize" | "autoScale" | "onResizeStart" | "onResize" | "onResizeEnd"> & {
	/**
	 * Position of the control.
	 * @example ControlPosition.TopLeft, ControlPosition.TopRight,
	 * ControlPosition.BottomLeft, ControlPosition.BottomRight
	 */
	position?: ControlPosition;
	/**
	 * Variant of the control.
	 * @default "handle"
	 * @example ResizeControlVariant.Handle, ResizeControlVariant.Line
	 */
	variant?: ResizeControlVariant;
	/**
	 * The direction the user can resize the node.
	 * If not provided, the user can resize in any direction.
	 */
	resizeDirection?: ResizeControlDirection;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
};
/**
 * @expand
 */
export type ResizeControlLineProps = Omit<ResizeControlProps, "resizeDirection"> & {
	position?: ControlLinePosition;
};
/**
 * The `<NodeResizer />` component can be used to add a resize functionality to your
 * nodes. It renders draggable controls around the node to resize in all directions.
 * @public
 *
 * @example
 *```jsx
 *import { memo } from 'react';
 *import { Handle, Position, NodeResizer } from '@xyflow/react';
 *
 *function ResizableNode({ data }) {
 *  return (
 *    <>
 *      <NodeResizer minWidth={100} minHeight={30} />
 *      <Handle type="target" position={Position.Left} />
 *      <div style={{ padding: 10 }}>{data.label}</div>
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *
 *export default memo(ResizableNode);
 *```
 */
export declare function NodeResizer({ nodeId, isVisible, handleClassName, handleStyle, lineClassName, lineStyle, color, minWidth, minHeight, maxWidth, maxHeight, keepAspectRatio, autoScale, shouldResize, onResizeStart, onResize, onResizeEnd, }: NodeResizerProps): import("react/jsx-runtime").JSX.Element | null;
declare function ResizeControl({ nodeId, position, variant, className, style, children, color, minWidth, minHeight, maxWidth, maxHeight, keepAspectRatio, resizeDirection, autoScale, shouldResize, onResizeStart, onResize, onResizeEnd, }: ResizeControlProps): import("react/jsx-runtime").JSX.Element;
/**
 * To create your own resizing UI, you can use the `NodeResizeControl` component where you can pass children (such as icons).
 * @public
 *
 */
export declare const NodeResizeControl: import("react").MemoExoticComponent<typeof ResizeControl>;
/**
 * @expand
 */
export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
	/**
	 * By passing in an array of node id's you can render a single tooltip for a group or collection
	 * of nodes.
	 */
	nodeId?: string | string[];
	/** If `true`, node toolbar is visible even if node is not selected. */
	isVisible?: boolean;
	/**
	 * Position of the toolbar relative to the node.
	 * @default Position.Top
	 * @example Position.TopLeft, Position.TopRight, Position.BottomLeft, Position.BottomRight
	 */
	position?: Position;
	/**
	 * The space between the node and the toolbar, measured in pixels.
	 * @default 10
	 */
	offset?: number;
	/**
	 * Align the toolbar relative to the node.
	 * @default "center"
	 * @example Align.Start, Align.Center, Align.End
	 */
	align?: Align;
};
/**
 * This component can render a toolbar or tooltip to one side of a custom node. This
 * toolbar doesn't scale with the viewport so that the content is always visible.
 *
 * @public
 * @example
 * ```jsx
 *import { memo } from 'react';
 *import { Handle, Position, NodeToolbar } from '@xyflow/react';
 *
 *function CustomNode({ data }) {
 *  return (
 *    <>
 *      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition}>
 *        <button>delete</button>
 *        <button>copy</button>
 *        <button>expand</button>
 *      </NodeToolbar>
 *
 *      <div style={{ padding: '10px 20px' }}>
 *        {data.label}
 *      </div>
 *
 *      <Handle type="target" position={Position.Left} />
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *
 *export default memo(CustomNode);
 *```
 * @remarks By default, the toolbar is only visible when a node is selected. If multiple
 * nodes are selected it will not be visible to prevent overlapping toolbars or
 * clutter. You can override this behavior by setting the `isVisible` prop to `true`.
 */
export declare function NodeToolbar({ nodeId, children, className, style, isVisible, position, offset, align, ...rest }: NodeToolbarProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * @inline
 */
export type EdgeToolbarProps = EdgeToolbarBaseProps & HTMLAttributes<HTMLDivElement> & {
	/**
	 * An edge toolbar must be attached to an edge.
	 */
	edgeId: string;
	children?: ReactNode;
};
/**
 * This component can render a toolbar or tooltip to one side of a custom edge. This
 * toolbar doesn't scale with the viewport so that the content stays the same size.
 *
 * @public
 * @example
 * ```jsx
 * import { EdgeToolbar, BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";
 *
 * export function CustomEdge({ id, data, ...props }: EdgeProps) {
 *   const [edgePath, centerX, centerY] = getBezierPath(props);
 *
 *   return (
 *     <>
 *       <BaseEdge id={id} path={edgePath} />
 *       <EdgeToolbar edgeId={id} x={centerX} y={centerY} isVisible>
 *         <button onClick={() => console.log('edge', id, 'click')}}>Click me</button>
 *       </EdgeToolbar>
 *     </>
 *   );
 * }
 * ```
 */
export declare function EdgeToolbar({ edgeId, x, y, children, className, style, isVisible, alignX, alignY, ...rest }: EdgeToolbarProps): import("react/jsx-runtime").JSX.Element | null;
export declare function addEdge<EdgeType extends EdgeBase>(edgeParams: EdgeType | Connection, edges: EdgeType[], options?: AddEdgeOptions): EdgeType[];
export declare function reconnectEdge<EdgeType extends EdgeBase>(oldEdge: EdgeType, newConnection: Connection, edges: EdgeType[], options?: ReconnectEdgeOptions): EdgeType[];
type Handle$1 = Handle;
interface Selection$1<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> {
	/**
	 * Interrupts the active transition of the specified name on the selected elements, and cancels any pending transitions with the specified name, if any.
	 * If a name is not specified, null is used.
	 *
	 * IMPORTANT: Interrupting a transition on an element has no effect on any transitions on any descendant elements.
	 * For example, an axis transition consists of multiple independent, synchronized transitions on the descendants of the axis G element
	 * (the tick lines, the tick labels, the domain path, etc.). To interrupt the axis transition, you must therefore interrupt the descendants.
	 *
	 * @param name Name of the transition.
	 */
	interrupt(name?: string): this;
	/**
	 * Returns a new transition on the given selection with the specified name. If a name is not specified, null is used.
	 * The new transition is only exclusive with other transitions of the same name.
	 *
	 * @param name Name of the transition.
	 */
	transition(name?: string): Transition<GElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new transition on the given selection.
	 *
	 * When using a transition instance, the returned transition has the same id and name as the specified transition.
	 * If a transition with the same id already exists on a selected element, the existing transition is returned for that element.
	 * Otherwise, the timing of the returned transition is inherited from the existing transition of the same id on the nearest ancestor of each selected element.
	 * Thus, this method can be used to synchronize a transition across multiple selections,
	 * or to re-select a transition for specific elements and modify its configuration.
	 *
	 * If the specified transition is not found on a selected node or its ancestors (such as if the transition already ended),
	 * the default timing parameters are used; however, in a future release, this will likely be changed to throw an error.
	 *
	 * @param transition A transition instance.
	 */
	transition(transition: Transition<BaseType, any, any, any>): Transition<GElement, Datum, PElement, PDatum>;
}
interface Transition<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> {
	// Sub-selection -------------------------
	/**
	 * For each selected element, select the first descendant element that matches the specified selector string, if any,
	 * and returns a transition on the resulting selection. The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * The generic represents the type of the descendant element to be selected.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	select<DescElement extends BaseType>(selector: string): Transition<DescElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, select the descendant element returned by the selector function, if any,
	 * and returns a transition on the resulting selection. The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * The generic represents the type of the descendant element to be selected.
	 *
	 * @param selector A selector function, which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * It must return an element, or null if there is no matching element.
	 */
	select<DescElement extends BaseType>(selector: ValueFn<GElement, Datum, DescElement>): Transition<DescElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, select all descendant elements that match the specified selector string, if any,
	 * and returns a transition on the resulting selection. The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element, the existing transition is returned for that element.
	 *
	 * The first generic "DescElement" refers to the type of descendant element to be selected. The second generic "OldDatum" refers to the type of the
	 * datum, of a selected element. This is useful when re-selecting elements with a previously set, know datum type.
	 *
	 * @param selector CSS selector string
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectAll<DescElement extends BaseType, OldDatum>(selector: string): Transition<DescElement, OldDatum, GElement, Datum>;
	/**
	 * For each selected element, select all descendant elements returned by the selector function, if any,
	 * and returns a transition on the resulting selection. The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element, the existing transition is returned for that element.
	 *
	 * The first generic "DescElement" refers to the type of descendant element to be selected. The second generic "OldDatum" refers to the type of the
	 * datum, of a selected element. This is useful when re-selecting elements with a previously set, know datum type.
	 *
	 * @param selector A selector function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). It must return an array of elements
	 * (or a pseudo-array, such as a NodeList), or the empty array if there are no matching elements.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectAll<DescElement extends BaseType, OldDatum>(selector: ValueFn<GElement, Datum, DescElement[] | ArrayLike$1<DescElement>>): Transition<DescElement, OldDatum, GElement, Datum>;
	/**
	 * For each selected element, selects the first child element that matches the specified selector string, if any, and returns a transition on the resulting selection.
	 * The selector may be specified either as a selector string or a function.
	 * If a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element.
	 * The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element, the existing transition is returned for that element.
	 * This method is equivalent to deriving the selection for this transition via transition.selection,
	 * creating a subselection via selection.selectChild, and then creating a new transition via selection.transition.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChild<DescElement extends BaseType, OldDatum>(selector?: string | ValueFn<GElement, Datum, DescElement>): Transition<DescElement, OldDatum, GElement, Datum>;
	/**
	 * For each selected element, selects all children that match the specified selector string, if any, and returns a transition on the resulting selection.
	 * The selector may be specified either as a selector string or a function.
	 * If a function, it is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element.
	 * The new transition has the same id, name and timing as this transition;
	 * however, if a transition with the same id already exists on a selected element, the existing transition is returned for that element.
	 * This method is equivalent to deriving the selection for this transition via transition.selection,
	 * creating a subselection via selection.selectChildren, and then creating a new transition via selection.transition.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	selectChildren<DescElement extends BaseType, OldDatum>(selector?: string | ValueFn<GElement, Datum, DescElement>): Transition<DescElement, OldDatum, GElement, Datum>;
	/**
	 * Return the selection corresponding to this transition.
	 */
	selection(): Selection$1<GElement, Datum, PElement, PDatum>;
	/**
	 * Returns a new transition on the same selected elements as this transition, scheduled to start when this transition ends.
	 * The new transition inherits a reference time equal to this transition’s time plus its delay and duration.
	 * The new transition also inherits this transition’s name, duration, and easing.
	 * This method can be used to schedule a sequence of chained transitions.
	 *
	 * A delay configured for the new transition will be relative to the previous transition.
	 */
	transition(): Transition<GElement, Datum, PElement, PDatum>;
	// Modifying -------------------------------
	/**
	 * For each selected element, assigns the attribute tween for the attribute with the specified name to the specified target value.
	 * The starting value of the tween is the attribute’s value when the transition starts.
	 * If the target value is null, the attribute is removed when the transition starts.
	 */
	attr(name: string, value: null | string | number | boolean): this;
	/**
	 * For each selected element, assigns the attribute tween for the attribute with the specified name to the specified target value.
	 * The starting value of the tween is the attribute’s value when the transition starts.
	 * The target value is return value of the value function evaluated for the selected element.
	 *
	 * An interpolator is chosen based on the type of the target value, using the following algorithm:
	 * 1.) If value is a number, use interpolateNumber.
	 * 2.) If value is a color or a string coercible to a color, use interpolateRgb.
	 * 3.) Use interpolateString.
	 *
	 * To apply a different interpolator, use transition.attrTween.
	 *
	 * @param name Name of the attribute.
	 * @param value A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * A null value will clear the attribute at the start of the transition.
	 */
	attr(name: string, value: ValueFn<GElement, Datum, string | number | boolean | null>): this;
	/**
	 * Return the current interpolator factory for attribute with the specified name, or undefined if no such tween exists.
	 *
	 * @param name Name of attribute.
	 */
	attrTween(name: string): ValueFn<GElement, Datum, (this: GElement, t: number) => string> | undefined;
	/**
	 * Remove the previously-assigned attribute tween of the specified name, if any.
	 *
	 * @param name Name of attribute.
	 * @param factory Use null to remove previously-assigned attribute tween.
	 */
	attrTween(name: string, factory: null): this;
	/**
	 * Assign the attribute tween for the attribute with the specified name to the specified interpolator factory.
	 * An interpolator factory is a function that returns an interpolator; when the transition starts, the factory is evaluated for each selected element.
	 * The returned interpolator will then be invoked for each frame of the transition, in order,
	 * being passed the eased time t, typically in the range [0, 1]. Lastly, the return value of the interpolator will be used to set the attribute value.
	 * The interpolator must return a string.
	 *
	 * @param name Name of attribute.
	 * @param factory An interpolator factory which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The interpolator factory returns a string interpolator,
	 * which takes as its argument eased time t, typically in the range [0, 1] and returns the interpolated string.
	 */
	attrTween(name: string, factory: ValueFn<GElement, Datum, (this: GElement, t: number) => string>): this;
	/**
	 * For each selected element, the style with the specified name will be cleared at the start of the transition.
	 *
	 * @param name Name of the style.
	 * @param value Use null to clear the style.
	 */
	style(name: string, value: null): this;
	/**
	 * For each selected element, assigns the style tween for the style with the specified name to the specified target value with the
	 * specified priority.
	 * The starting value of the tween is the style’s inline value if present, and otherwise its computed value.
	 * The target value is the specified constant value for all elements.
	 *
	 * An interpolator is chosen based on the type of the target value, using the following algorithm:
	 * 1.) If value is a number, use interpolateNumber.
	 * 2.) If value is a color or a string coercible to a color, use interpolateRgb.
	 * 3.) Use interpolateString.
	 *
	 * To apply a different interpolator, use transition.attrTween.
	 *
	 * @param name Name of the style.
	 * @param value Target value for the style.
	 * @param priority An optional priority flag, either null or the string important (without the exclamation point)
	 */
	style(name: string, value: string | number | boolean, priority?: null | "important"): this;
	/**
	 * For each selected element, assigns the style tween for the style with the specified name to the specified target value with the
	 * specified priority.
	 * The starting value of the tween is the style's inline value if present, and otherwise its computed value.
	 * The target value is return value of the value function evaluated for the selected element.
	 *
	 * An interpolator is chosen based on the type of the target value, using the following algorithm:
	 * 1.) If value is a number, use interpolateNumber.
	 * 2.) If value is a color or a string coercible to a color, use interpolateRgb.
	 * 3.) Use interpolateString.
	 *
	 * To apply a different interpolator, use transition.attrTween.
	 *
	 * @param name Name of the style.
	 * @param value A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * A null value will clear the style at the start of the transition.
	 * @param priority An optional priority flag, either null or the string important (without the exclamation point)
	 */
	style(name: string, value: ValueFn<GElement, Datum, string | number | boolean | null>, priority?: null | "important"): this;
	/**
	 * Return the current interpolator factory for style with the specified name, or undefined if no such tween exists.
	 *
	 * @param name Name of style.
	 */
	styleTween(name: string): ValueFn<GElement, Datum, (this: GElement, t: number) => string> | undefined;
	/**
	 * Remove the previously-assigned style tween of the specified name, if any.
	 *
	 * @param name Name of style.
	 * @param factory Use null to remove previously-assigned style tween.
	 */
	styleTween(name: string, factory: null): this;
	/**
	 * Assign the style tween for the style with the specified name to the specified interpolator factory.
	 * An interpolator factory is a function that returns an interpolator; when the transition starts, the factory is evaluated for each selected element.
	 * The returned interpolator will then be invoked for each frame of the transition, in order,
	 * being passed the eased time t, typically in the range [0, 1]. Lastly, the return value of the interpolator will be used to set the style value.
	 * The interpolator must return a string.
	 *
	 * @param name Name of style.
	 * @param factory An interpolator factory which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The interpolator factory returns a string interpolator,
	 * which takes as its argument eased time t, typically in the range [0, 1] and returns the interpolated string.
	 * @param priority An optional priority flag, either null or the string important (without the exclamation point)
	 */
	styleTween(name: string, factory: ValueFn<GElement, Datum, (this: GElement, t: number) => string>, priority?: null | "important"): this;
	/**
	 * For each selected element, sets the text content to the specified target value when the transition starts.
	 * A null value will clear the content.
	 */
	text(value: null | string | number | boolean): this;
	/**
	 * For each selected element, sets the text content returned by the value function for each selected element when the transition starts.
	 *
	 * To interpolate text rather than to set it on start, use transition.textTween (for example) or append a replacement element and cross-fade opacity (for example).
	 * Text is not interpolated by default because it is usually undesirable.
	 *
	 * @param value A value function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * A null value will clear the text content at the start of the transition.
	 */
	text(value: ValueFn<GElement, Datum, string | number | boolean>): this;
	/**
	 * Returns the current interpolator factory for text, or undefined if no such tween exists.
	 */
	textTween(): ValueFn<GElement, Datum, (this: GElement, t: number) => string> | undefined;
	/**
	 * Removes the previously-assigned text tween, if any
	 *
	 * @param factory Use null to remove previously-assigned text tween.
	 */
	textTween(factory: null): this;
	/**
	 * Assigns the text tween to the specified interpolator factory.
	 * An interpolator factory is a function that returns an interpolator; when the transition starts, the factory is evaluated for each selected element,
	 * in order, being passed the current datum d and index i, with the this context as the current DOM element.
	 * The returned interpolator will then be invoked for each frame of the transition, in order, being passed the eased time t, typically in the range [0, 1].
	 * Lastly, the return value of the interpolator will be used to set the text.
	 * The interpolator must return a string.
	 *
	 * @param factory An interpolator factory is a function that returns an interpolator; when the transition starts, the factory is evaluated for each selected element,
	 * in order, being passed the current datum d and index i, with the this context as the current DOM element.
	 * The returned interpolator will then be invoked for each frame of the transition, in order, being passed the eased time t, typically in the range [0, 1].
	 * Lastly, the return value of the interpolator will be used to set the text.
	 * The interpolator must return a string.
	 */
	textTween(factory: ValueFn<GElement, Datum, (this: GElement, t: number) => string>): this;
	/**
	 * For each selected element, removes the element when the transition ends, as long as the element has no other active or pending transitions.
	 * If the element has other active or pending transitions, does nothing.
	 */
	remove(): this;
	/**
	 * Returns the tween with the specified name, or undefined, if no tween was previously assigned to
	 * that name.
	 *
	 * @param name Name of tween.
	 */
	tween(name: string): ValueFn<GElement, Datum, (this: GElement, t: number) => void> | undefined;
	/**
	 * Removes the tween with the specified name, if a tween was previously assigned to
	 * that name.
	 *
	 * @param name Name of tween.
	 * @param tweenFn Use null to remove a previously-assigned tween.
	 */
	tween(name: string, tweenFn: null): this;
	/**
	 * For each selected element, assigns the tween with the specified name with the specified value function.
	 * The value must be specified as a function that returns a function.
	 * When the transition starts, the value function is evaluated for each selected element.
	 * The returned function is then invoked for each frame of the transition, in order,
	 * being passed the eased time t, typically in the range [0, 1].
	 *
	 * @param name Name of tween.
	 * @param tweenFn A tween function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The tween function returns a function
	 * which takes as its argument eased time t, typically in the range [0, 1] and performs the tweening activities for each transition frame.
	 */
	tween(name: string, tweenFn: ValueFn<GElement, Datum, (this: GElement, t: number) => void>): this;
	/**
	 * Returns a new transition merging this transition with the specified other transition,
	 * which must have the same id as this transition. The returned transition has the same number of groups,
	 * the same parents, the same name and the same id as this transition.
	 * Any missing (null) elements in this transition are filled with the corresponding element, if present (not null), from the other transition.
	 *
	 * @param other The transition to be merged.
	 */
	merge(other: Transition<GElement, Datum, PElement, PDatum>): Transition<GElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, selects only the elements that match the specified filter, and returns a transition on the resulting selection.
	 *
	 * The new transition has the same id, name and timing as this transition; however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * @param filter A CSS selector string.
	 */
	filter(filter: string): Transition<GElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, selects only the elements that match the specified filter, and returns a transition on the resulting selection.
	 *
	 * The new transition has the same id, name and timing as this transition; however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * The generic refers to the type of element which will be selected after applying the filter, i.e. if the element types
	 * contained in a pre-filter selection are narrowed to a subset as part of the filtering.
	 *
	 * @param filter A CSS selector string.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	filter<FilteredElement extends BaseType>(filter: string): Transition<FilteredElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, selects only the elements that match the specified filter, and returns a transition on the resulting selection.
	 *
	 * The new transition has the same id, name and timing as this transition; however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * @param filter A filter function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The filter function returns a boolean indicating,
	 * whether the selected element matches.
	 */
	filter(filter: ValueFn<GElement, Datum, boolean>): Transition<GElement, Datum, PElement, PDatum>;
	/**
	 * For each selected element, selects only the elements that match the specified filter, and returns a transition on the resulting selection.
	 *
	 * The new transition has the same id, name and timing as this transition; however, if a transition with the same id already exists on a selected element,
	 * the existing transition is returned for that element.
	 *
	 * The generic refers to the type of element which will be selected after applying the filter, i.e. if the element types
	 * contained in a pre-filter selection are narrowed to a subset as part of the filtering.
	 *
	 * @param filter A filter function which is evaluated for each selected element, in order, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The filter function returns a boolean indicating,
	 * whether the selected element matches.
	 */
	// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
	filter<FilteredElement extends BaseType>(filter: ValueFn<GElement, Datum, boolean>): Transition<FilteredElement, Datum, PElement, PDatum>;
	// Event Handling -------------------
	/**
	 * Return the currently-assigned listener for the specified event typename on the first (non-null) selected element, if any.
	 * If multiple typenames are specified, the first matching listener is returned.
	 *
	 * @param typenames The typenames is one of the following string event types: start (when the transition starts), end (when the transition ends),
	 * interrupt (when the transition is interrupted), cancel(when the transition is cancelled).
	 * Note that these are not native DOM events. The type may be optionally followed by a period (.) and a name;
	 * the optional name allows multiple callbacks to be registered to receive events of the same type, such as "start.foo"" and "start.bar".
	 * To specify multiple typenames, separate typenames with spaces, such as "interrupt end"" or "start.foo start.bar".
	 */
	on(typenames: string): ValueFn<GElement, Datum, void> | undefined;
	/**
	 * Remove all listeners for a given name.
	 *
	 * @param typenames Name of the event type for which the listener should be removed. To remove all listeners for a given name use ".foo"
	 * as the typename, where foo is the name; to remove all listeners with no name, specify "." as the typename.
	 * @param listener Use null to remove listeners.
	 */
	on(typenames: string, listener: null): this;
	/**
	 * Add a listener to each selected element for the specified event typenames.
	 *
	 * When a specified transition event is dispatched on a selected node, the specified listener will be invoked for each transitioning element.
	 * Listeners always see the latest datum for their element, but the index is a property of the selection and is fixed when the listener is assigned;
	 * to update the index, re-assign the listener.
	 *
	 * @param typenames The typenames is one of the following string event types: start (when the transition starts), end (when the transition ends),
	 * interrupt (when the transition is interrupted), cancel(when the transition is cancelled).
	 * Note that these are not native DOM events. The type may be optionally followed by a period (.) and a name;
	 * the optional name allows multiple callbacks to be registered to receive events of the same type, such as "start.foo"" and "start.bar".
	 * To specify multiple typenames, separate typenames with spaces, such as "interrupt end"" or "start.foo start.bar".
	 * @param listener A listener function which will be evaluated for each selected element, being passed the current datum (d), the current index (i),
	 * and the current group (nodes), with this as the current DOM element (nodes[i]). Listeners always see the latest datum for their element,
	 * but the index is a property of the selection and is fixed when the listener is assigned; to update the index, re-assign the listener.
	 */
	on(typenames: string, listener: ValueFn<GElement, Datum, void>): this;
	/**
	 * Returns a promise that resolves when every selected element finishes transitioning. If any element’s transition is cancelled or interrupted, the promise rejects.
	 */
	end(): Promise<void>;
	// Control Flow ----------------------
	/**
	 * Invoke the specified function for each selected element, passing the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 * This method can be used to invoke arbitrary code for each selected element, and is useful for creating a context to access parent and child data simultaneously.
	 *
	 * @param func A function which is invoked for each selected element,
	 *             being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
	 */
	each(func: ValueFn<GElement, Datum, void>): this;
	/**
	 * Invoke the specified function exactly once, passing in this transition along with any optional arguments.
	 * Returns this transition.
	 *
	 * @param func A function which is passed this transition as the first argument along with any optional arguments.
	 * @param args List of optional arguments to be passed to the callback function.
	 */
	call(func: (transition: Transition<GElement, Datum, PElement, PDatum>, ...args: any[]) => any, ...args: any[]): this;
	/**
	 * Return true if this transition contains no (non-null) elements.
	 */
	empty(): boolean;
	/**
	 * Return the first (non-null) element in this transition. If the transition is empty, returns null.
	 */
	node(): GElement | null;
	/**
	 * Return an array of all (non-null) elements in this transition.
	 */
	nodes(): GElement[];
	/**
	 * Returns the total number of elements in this transition.
	 */
	size(): number;
	// Transition Configuration ----------------------
	/**
	 * Returns the current value of the delay for the first (non-null) element in the transition.
	 * This is generally useful only if you know that the transition contains exactly one element.
	 */
	delay(): number;
	/**
	 * For each selected element, sets the transition delay to the specified value in milliseconds.
	 * If a delay is not specified, it defaults to zero.
	 *
	 * @param milliseconds Number of milliseconds for the delay.
	 */
	delay(milliseconds: number): this;
	/**
	 * For each selected element, sets the transition delay to the value in milliseconds returned by the
	 * value function.
	 *
	 * @param milliseconds A value function which is evaluated for each selected element, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The return value is a number
	 * specifying the delay in milliseconds.
	 */
	delay(milliseconds: ValueFn<GElement, Datum, number>): this;
	/**
	 * Returns the current value of the duration for the first (non-null) element in the transition.
	 * This is generally useful only if you know that the transition contains exactly one element.
	 */
	duration(): number;
	/**
	 * For each selected element, sets the transition duration to the specified value in milliseconds.
	 * If a duration is not specified, it defaults to 250ms.
	 *
	 * @param duration Number of milliseconds for the duration.
	 */
	duration(milliseconds: number): this;
	/**
	 * For each selected element, sets the transition duration to the value in milliseconds returned by the
	 * value function.
	 *
	 * @param milliseconds A value function which is evaluated for each selected element, being passed the current datum (d),
	 * the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]). The return value is a number
	 * specifying the duration in milliseconds.
	 */
	duration(milliseconds: ValueFn<GElement, Datum, number>): this;
	/**
	 * Returns the current easing function for the first (non-null) element in the transition.
	 * This is generally useful only if you know that the transition contains exactly one element.
	 */
	ease(): (normalizedTime: number) => number;
	/**
	 * Specifies the transition easing function for all selected elements. The value must be specified as a function.
	 * The easing function is invoked for each frame of the animation, being passed the normalized time t in the range [0, 1];
	 * it must then return the eased time tʹ which is typically also in the range [0, 1].
	 * A good easing function should return 0 if t = 0 and 1 if t = 1. If an easing function is not specified,
	 * it defaults to d3.easeCubic.
	 *
	 * @param easingFn An easing function which is passed the normalized time t in the range [0, 1];
	 * it must then return the eased time tʹ which is typically also in the range [0, 1].
	 * A good easing function should return 0 if t = 0 and 1 if t = 1.
	 */
	ease(easingFn: (normalizedTime: number) => number): this;
	/**
	 * Specifies a factory for the transition easing function.
	 *
	 * @param factory The factory must be a function.
	 * It is invoked for each node of the selection, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element.
	 * It must return an easing function.
	 */
	easeVarying(factory: ValueFn<GElement, Datum, (normalizedTime: number) => number>): this;
}

export {
	BezierEdge$1 as BezierEdge,
	Handle$1 as Handle,
	HandleProps$1 as HandleProps,
	IsValidConnection$1 as IsValidConnection,
	Node$1 as Node,
	NodeProps$1 as NodeProps,
	SelectionMode$1 as SelectionMode,
	SmoothStepEdge$1 as SmoothStepEdge,
	StepEdge$1 as StepEdge,
	StraightEdge$1 as StraightEdge,
	_default as ReactFlow,
};

export {};
